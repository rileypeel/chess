import * as actions from '../actions/webSocket'
import { saveInvite, setInviteSender } from '../actions/user'
import { setAcceptModalOpen, setGoToGame } from '../actions/ui'
import * as gameActions from '../actions/game'
import { notify } from '../services/notification'
import * as constants from '../constants/app'

const socketMiddleware = () => {
  var socket = null

  const inviteRemovalCallback = (store, invite, from) => (id, removedBy) => {
    if (removedBy === constants.CLICK) {
      store.dispatch(setInviteSender(from))
      store.dispatch(saveInvite(invite))
      store.dispatch(setAcceptModalOpen(true))
    }
  }

  const onMessage = store => (event) => {
    const payload = JSON.parse(event.data)
    switch(payload.type) {
      case constants.UPDATE_TIME:
        store.dispatch(
          gameActions.setTime(
            payload.opponent_time,
            constants.OPPONENT,
            payload.game_id
          )
        )
        store.dispatch(
          gameActions.setTime(
            payload.my_time,
            constants.ME,
            payload.game_id
          )
        )
        break
      case constants.LOAD_BOARD:
        store.dispatch(gameActions.loadBoard(payload.board, payload.game_id))
        break
      case constants.OPPONENT_MESSAGE: 
        store.dispatch(
          gameActions.addMessage(
            { sender: payload.message.user, message: payload.message.message },
            payload.message.game
          )
        )
        break
      case constants.GAME_STATUS_UPDATE:
        store.dispatch(gameActions.setMyTurn(false, payload.game_id))
        notify(
          payload.status,
          payload.winner ? 'You won!' : 'You lost, better luck next time',
          {
            type: payload.winner ? 'success' : 'danger',
            container: 'center'
          }
        )
        break
      case constants.LOAD_MOVES:
        store.dispatch(gameActions.loadMoves(payload.move_list, payload.game_id))
        break
      case constants.LOAD_GAME:
        store.dispatch(gameActions.loadGame(payload.game, payload.me, payload.opponent))
        break
      case constants.LOAD_MESSAGES:
        const messages = payload.message
        messages.forEach(message => {
          store.dispatch(
            gameActions.addMessage(
              { sender: message.user, message: message.message },
              message.game
            )
          )
        })
        break
      case constants.INVITE_RECEIVED:
        const inviteFrom = payload.invite.from_user
        notify(
          `Invite from ${inviteFrom.name}`,
          'Click to Accept',
          {
            type: 'success',
            onRemoval: inviteRemovalCallback(store, payload.invite, inviteFrom)
          }
        )
        break
      case constants.INVITE_UPDATE:
        break
      case constants.ERROR:
        break
      case constants.START_TURN:
        store.dispatch(gameActions.loadValidMoves(payload.valid_moves, payload.game_id))
        store.dispatch(gameActions.setMyTurn(true, payload.game_id))
        store.dispatch(
          gameActions.setTime(
            Math.trunc(payload.opponent_time), 
            'opponent',
            payload.game_id
          )
        )
        store.dispatch(gameActions.setTime(Math.trunc(payload.my_time), 'me', payload.game_id))
        break
      case constants.START_GAME:
        notify(
          'Game Started',
          `Game with ${payload.opponent.user.name} has started`, {
            type: 'warning',
            animation: 'slide'
          }
        )
        store.dispatch(setGoToGame(payload.game.id))
        store.dispatch(gameActions.loadGame(payload.game, payload.me, payload.opponent))
        break
      case constants.OPPONENT_MOVE:
        const move = payload.move
        const moveNotation = payload.move.notation
        const from = { col: move.from[0], row: move.from[1] }
        const to = { col: move.to[0], row: move.to[1] }
        store.dispatch(gameActions.movePiece(from, to, payload.game_id))
        if (move.type == constants.EN_PASSANT) {
          store.dispatch(
            gameActions.removePiece(
              { col: move.to[0], row: move.from[1] },
              payload.game_id
              )
            )
        } else if (move.type == constants.CASTLE) {
          store.dispatch(
            gameActions.movePiece(
              { row: move.from[1], col: move.to[0] == 1 ? 0 : 7 },
              { row: move.to[1], col: move.to[0] == 1 ? 2 : 5},
              payload.game_id
            )
          )
        }
        store.dispatch(gameActions.addMoveNotation(moveNotation, payload.game_id))
        break
      case constants.MOVE_RESPONSE:
        if (payload.success) {
          const moveNotation = payload.notation
          store.dispatch(gameActions.addMoveNotation(moveNotation, payload.game_id))
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

      case actions.UPDATE_TIMES:
        socket.send(JSON.stringify({
          type: constants.REQUEST_UPDATE_TIME,
          game_id: action.gameId
        }))
        break

      case actions.ACCEPT_INVITE:
        socket.send(JSON.stringify({
          type: constants.INVITE_RESPONSE,
          id: action.inviteId,
          accepted: true
        }))
        break

      case actions.DECLINE_INVITE:
        socket.send(JSON.stringify({
          type: constants.INVITE_RESPONSE,
          id: action.inviteId,
          accepted: false
        }))
        break
  
      case actions.SEND_CHAT_MESSAGE:
        const message = {
          type: constants.CHAT_MESSAGE,
          game_id: action.gameId,
          message: action.message
        }
        socket.send(JSON.stringify(message))
        break

      case actions.SEND_MOVE:
        socket.send(JSON.stringify({
          type: constants.MOVE,
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