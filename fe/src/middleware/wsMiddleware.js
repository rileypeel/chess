import * as actions from '../actions/webSocket'
import { store as notificationStore } from 'react-notifications-component'
import { loadGameInvites, saveInvite, setInviteSender } from '../actions/user'
import { setAcceptModalOpen } from '../actions/ui'
import * as gameActions from '../actions/game'
import { notify } from '../services/notification'
//Bug list TODO
  // login response undefined error when login fails



//NEW TYPES 
// RECEIVE TYPES
const START_TURN = 'start_turn'
const LOAD_GAME = 'load_game'
const LOAD_MOVES = 'load_moves'
const LOAD_MESSAGES = 'load_messages'
const OPPONENT_MESSAGE = 'opponent_message'
const OPPONENT_MOVE = 'opponent_move'
const GAME_STATUS_UPDATE = 'status_update'
const INVITE_RECEIVED = 'invite_received'
const INVITE_UPDATE = 'invite_update'
const ERROR = 'client_error'
const START_GAME = 'start_game'
//SENDER TYPES
const SEND_MESSAGE = 'my_message'
const MOVE = 'game_my_move'
const CHAT_MESSAGE = 'game_my_message'
const ACCEPT_INVITE = 'invite_accepted'
const INVITE_RESPONSE = 'invite_response'
const MOVE_RESPONSE = 'move_response'

const formatMoves = piece => {
  const formattedMoves = piece.moves.map((move) => {
    return { col: move[0], row: move[1] }
  })
  return {
    position: { col: piece.position[0], row: piece.position[1] },
    moves: formattedMoves
  }
}

const socketMiddleware = () => {

  var socket = null

  const inviteRemovalCallback = (store, invite, from) => (id, removedBy) => {
    if (removedBy === 'click') {
      store.dispatch(setInviteSender(from))
      store.dispatch(saveInvite(invite))
      store.dispatch(setAcceptModalOpen(true))
    }
  }


  const onMessage = store => (event) => {
    const payload = JSON.parse(event.data)
    console.log(payload)
    switch(payload.type) {
      case OPPONENT_MESSAGE: 
        store.dispatch(gameActions.addMessage(
          { sender: payload.message.user, message: payload.message.message },
          payload.message.game
        ))
        //dispatch action to push message
        break
      case GAME_STATUS_UPDATE:
        //dispatch some sort of end of game action
        //store.dispatch(gameActions.gameOver(false))
        break
      case LOAD_MOVES:
        console.log("in load moves")
        console.log(payload)
        store.dispatch(gameActions.loadMoves(payload.move_list, payload.game_id))
        store.dispatch(gameActions.updateBoard(payload.game_id))
        break
      case LOAD_GAME:
        store.dispatch(gameActions.loadGame(payload.game, payload.me, payload.opponent))
        break
      case LOAD_MESSAGES:
        const messages = payload.message
        messages.forEach(message => {
          store.dispatch(gameActions.addMessage(
            { sender: message.user, message: message.message },
            message.game
          ))
        })
        break
      case INVITE_RECEIVED:
        console.log(payload)
        const inviteFrom = payload.invite.from_user
        notify(`Invite from ${inviteFrom.name}`, payload.invite.message, {
          type: 'success',
          onRemoval: inviteRemovalCallback(store, payload.invite, inviteFrom)
        })
        break
      case INVITE_UPDATE:
        break
      case ERROR:
        break
      case START_TURN:
        store.dispatch(gameActions.loadValidMoves(payload.valid_moves, payload.game_id))
        store.dispatch(gameActions.setMyTurn(true, payload.game_id))
        break
      case START_GAME:
        notify("Game Started", `Game with ${payload.opponent.name} has started`, {
          type: "warning",
          animation: "slide"
        })
        store.dispatch(gameActions.startGame(payload.game, payload.me, payload.opponent))

        break
      case OPPONENT_MOVE:
        const move = payload.move
        const moveNotation = payload.notation
        const from = { col: move.from[0], row: move.from[1] }
        const to = { col: move.to[0], row: move.to[1] }
        store.dispatch(gameActions.move(from, to, payload.game_id))
        store.dispatch(gameActions.addMoveNotation(moveNotation, payload.game_id))
        break
      case MOVE_RESPONSE:
        if (payload.success) {
          const moveNotation = payload.notation
          store.dispatch(gameActions.addMoveNotation(moveNotation, payload.game_id))
        } else {
          //dispatch a rollback move an an error message or something
        }
    }
  }

  const onClose = store => (event) => {
    console.log("closing socket....")
  }

  const onOpen = store => (event) => {
    
    store.dispatch(actions.wsConnected())
  }

return store => next => action => {
  

    switch (action.type) {
      case actions.CONNECT_WS:
        socket = new WebSocket(action.host)
        socket.onmessage = onMessage(store)
        socket.onclose = onClose(store)
        socket.onopen = onOpen(store)
        break
      case actions.ACCEPT_INVITE:
        socket.send(JSON.stringify({
          type: INVITE_RESPONSE,
          id: action.inviteId,
          accepted: true
        }))
        break
      case actions.DECLINE_INVITE:
        socket.send(JSON.stringify({
          type: INVITE_RESPONSE,
          id: action.inviteId,
          accepted: false
        }))
        break
    
      case actions.DISCONNECT_WS:
    
        //TODO
        break
      case actions.SEND_CHAT_MESSAGE:
        const message = {
          type: CHAT_MESSAGE,
          game_id: action.gameId,
          message: action.message
        }
        socket.send(JSON.stringify(message))
        break
      case actions.SEND_MOVE:
        socket.send(JSON.stringify({
          type: MOVE,
          move: {
            from: [action.from.col, action.from.row],
            to: [action.to.col, action.to.row]
          },
          game_id: action.gameId 
        }))
        break
      case actions.SEND_RESIGN:
        break
      default:
        return next(action)
    }

  }
}

export default socketMiddleware()