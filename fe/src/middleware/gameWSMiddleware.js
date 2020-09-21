import * as actions from '../actions/gameWebSocket'
import { useHistory } from 'react-router-dom'
import { notify } from '../services/notification'
import * as gameActions from '../actions/game'

const OPPONENT_MOVE = 'opponent_move'
const RECEIVE_MESSAGE = 'receive_message'
const OPPONENT_RESIGNED = 'opponent_resigned'
const START_TURN = 'start_turn'
const START_GAME = 'start_game'
const END_GAME = 'end_game'



const formatMoves = (piece) => {

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

  const onMessage = store => (event) => {
    const payload = JSON.parse(event.data)

    switch (payload.type){

      case START_TURN:
        //dispatch add valid moves
        const validMoves = payload.valid_moves.map((item) => formatMoves(item))
        
        store.dispatch(gameActions.loadValidMoves(validMoves))
        store.dispatch(gameActions.setMyTurn(true))
        break
      case START_GAME:

        store.dispatch(gameActions.setMyColour(payload.colour))
        break
      case OPPONENT_MOVE:
        const move = payload.move
        const from = { col: move.from[0], row: move.from[1] }
        const to = { col: move.to[0], row: move.to[1] }
        store.dispatch(gameActions.move(from, to))
        break
      case RECEIVE_MESSAGE:
        break
      case OPPONENT_RESIGNED:
        break
      case END_GAME:

        store.dispatch(gameActions.gameOver(false))
    }
  }

  const onClose = store => (event) => {
  }

  const onOpen = store => (event) => {
    
    store.dispatch(actions.gameWSConnected())
    //store.dispatch(actions.wsConnected())
  }

return store => next => action => {
    

    switch (action.type) {
      case actions.CONNECT_GAME_WS:
        socket = new WebSocket(action.gameUrl)
        socket.onmessage = onMessage(store)
        socket.onopen = onOpen(store)
        socket.onclose = onClose(store)
        break
      case actions.SEND_CHAT_MESSAGE:
        break
      case actions.SEND_MOVE:
        const message = {
          type: "player_move",
          move: { from: [action.from.col, action.from.row], to: [action.to.col, action.to.row] } 
        }
        socket.send(JSON.stringify(message))
        break
      case actions.SEND_RESIGN:
        break
      
    
      case actions.DISCONNECT_GAME_WS:
        break
      default:
        return next(action)
    }

  }
}

export default socketMiddleware()