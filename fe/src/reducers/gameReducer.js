import * as actions from '../actions/game'
import { pieces, BLACK, WHITE, EN_PASSANT, CASTLE } from '../constants/app'

const startingBoard = () => {
  var board = [[
    { piece: pieces.whiteRook, moves: [] },
    { piece: pieces.whiteKnight, moves: [] },
    { piece: pieces.whiteBishop, moves: [] },
    { piece: pieces.whiteQueen, moves: [] },
    { piece: pieces.whiteKing, moves: []},
    { piece: pieces.whiteBishop, moves: [] },
    { piece: pieces.whiteKnight, moves: [] },
    { piece: pieces.whiteRook, moves: [] }, 
  ]]
  board.push([
    { piece: pieces.whitePawn, moves: [] },
    { piece: pieces.whitePawn, moves: [] },
    { piece: pieces.whitePawn, moves: [] },
    { piece: pieces.whitePawn, moves: [] },
    { piece: pieces.whitePawn, moves: [] },
    { piece: pieces.whitePawn, moves: [] },
    { piece: pieces.whitePawn, moves: [] },
    { piece: pieces.whitePawn, moves: [] }, 
  ])
  for (var i = 0; i < 4; i++) {
    board.push([null, null, null, null, null, null, null, null])
  }
  board.push([
    { piece: pieces.blackPawn, moves: [] },
    { piece: pieces.blackPawn, moves: [] },
    { piece: pieces.blackPawn, moves: [] },
    { piece: pieces.blackPawn, moves: [] },
    { piece: pieces.blackPawn, moves: [] },
    { piece: pieces.blackPawn, moves: [] },
    { piece: pieces.blackPawn, moves: [] },
    { piece: pieces.blackPawn, moves: [] }, 
  ])
  board.push([
    { piece: pieces.blackRook, moves: [] },
    { piece: pieces.blackKnight, moves: [] },
    { piece: pieces.blackBishop, moves: [] },
    { piece: pieces.blackQueen, moves: [] },
    { piece: pieces.blackKing, moves: [] },
    { piece: pieces.blackBishop, moves: [] },
    { piece: pieces.blackKnight, moves: [] },
    { piece: pieces.blackRook, moves: [] }, 
  ])
  return board
}

const copyBoard = board => (
  board.map(
    row => row.map(
      square => (
        square
      )
    )
  )
)

const getInitialGameState = () => ({
  connected: false,
  id: null,
  board: startingBoard(),
  moveHistory: [],
  messages: [],
  selectedSquare: null,
  myTurn: false,
  myColour: BLACK,
  me: null,
  opponent: null,
  gameStatus: true,
  moveNotation: [],
})

function gameReducer(state = {}, action) {
  switch (action.type) {
    case actions.LOAD_GAME:
      if (!state[action.game.id]) {
        const newGame = getInitialGameState()
        newGame.status = action.game._status
        newGame.myColour = action.me.colour
        newGame.opponent = { ...action.opponent, user: { ...action.opponent.user } }
        newGame.id = action.game.id
        return { ...state,
          [action.game.id]: {
            game: newGame,
            time: {
              me: { time: action.me.time <= 0 ? 0 : action.me.time },
              opponent: { time: action.opponent.time <= 0 ? 0 : action.opponent.time } 
            }
          }
        }
      }
      return state

    case actions.LOAD_MOVES:
      const moves = action.moves.map((moveItem) => {
        return {
          from: { row: moveItem.from[1], col: moveItem.from[0] },
          to: { row: moveItem.to[1], col: moveItem.to[0] }
        }
      })
      return {
        ...state,
        [action.gameId]: {
          ...state[action.gameId],
          game: {
            ...state[action.gameId].game,
            moveHistory: moves
          }
        }
      }

    case actions.START_GAME: 
      if (!state[action.game.id]) {
        const newGame = getInitialGameState()
        newGame.status = action.game._status
        newGame.myColour = action.me.colour
        newGame.opponent = { ...action.opponent, user: { ...action.opponent.user } }
        newGame.id = action.game.id
        return { ...state,
          [action.game.id]: {
            game: newGame,
            time: {
              me: { time: action.me.time <= 0 ? 0 : action.me.time },
              opponent: { time: action.opponent.time <= 0 ? 0 : action.opponent.time } 
            } 
          }
        }
      }
      return state
    
    case actions.SET_MY_TURN:
      return {
        ...state,
        [action.gameId]: {
          ...state[action.gameId],
          game: {
            ...state[action.gameId].game,
            myTurn: action.value
          }
        }
      }

    case actions.SELECT_SQUARE:
      return {
        ...state,
        [action.gameId]: {
          ...state[action.gameId],
          game: {
            ...state[action.gameId].game,
            selectedSquare: {
              col: action.position.col,
              row: action.position.row
            }
          }
        }
      }
    
    case actions.SET_COLOUR:
      return {
        ...state,
        [action.gameId]: {
          ...state[action.gameId],
          game: {
            ...state[action.gameId].game,
            myColour: action.colour
          }
        }
      }

    case actions.UNSELECT_SQUARE:
      return {
        ...state,
        [action.gameId]: {
          ...state[action.gameId],
          game: {
            ...state[action.gameId].game,
            selectedSquare: null
          }
        }
      }

    case actions.MOVE:
      const moveBoard = copyBoard(state[action.gameId].game.board)
      const squareToMove = moveBoard[action.fromPos.row][action.fromPos.col] 
      moveBoard[action.fromPos.row][action.fromPos.col] = null
      moveBoard[action.toPos.row][action.toPos.col] = { piece: { ...squareToMove.piece }, moves: []}
      return {
        ...state,
        [action.gameId]: {
          ...state[action.gameId],
          game: {
            ...state[action.gameId].game,
            board: moveBoard,
            myTurn: false
          }
        }
      }
     
    case actions.LOAD_VALID_MOVES:
      console.log(action)
      const validMoveBoard = copyBoard(state[action.gameId].game.board)
      action.validMoves.forEach(item => {
        var passant = null
        var castle = null
        if (item.special_moves) {
          item.special_moves.forEach(specialItem => {
            if (specialItem.type == EN_PASSANT) {
              passant = {
                to: { row: specialItem.to[1], col: specialItem.to[0] },
                capture: { row: specialItem.capture[1], col: specialItem.capture[0] }
              } 
            } else if (specialItem.type == CASTLE) {
              castle = {
                to: { row: specialItem.to[1], col: specialItem.to[0] },
                rookTo: { row: specialItem.rook_to[1], col: specialItem.rook_to[0] },
                rookFrom: { row: specialItem.rook_from[1], col: specialItem.rook_from[0] }
              } 
            }
          })
        }
        validMoveBoard[item.position[1]][item.position[0]] = {
          ...state[action.gameId].game.board[item.position[1]][item.position[0]],
          moves: item.moves.map(
              move => (
                { col: move[0], row: move[1] }
              )
            ),
            passant, 
            castle
          }
        }
      )
      return {
        ...state,
        [action.gameId]: {
          ...state[action.gameId],
          game: {
            ...state[action.gameId].game,
            board: validMoveBoard
          }
        }
      }

    case actions.UPDATE_BOARD:
      const boardToUpdate = copyBoard(state[action.gameId].game.board)
      state[action.gameId].game.moveHistory.forEach(move => {
        boardToUpdate[move.to.row][move.to.col] = {
          ...boardToUpdate[move.from.row][move.from.col],
          moves: []
        }
        boardToUpdate[move.from.row][move.from.col] = null
      })
      return {
        ...state,
        [action.gameId]: {
          ...state[action.gameId],
          game: {
            ...state[action.gameId].game,
            board: boardToUpdate
          }
        }
      }

    case actions.GAME_END:
      return state 

    case actions.ADD_MESSAGE:
      const newMessages = state[action.gameId].game.messages.map(message => (message))
      newMessages.push({ ...action.message })
      return {
        ...state,
        [action.gameId]: {
          ...state[action.gameId],
          game: {
            ...state[action.gameId].game,
            messages: newMessages
          }
        }
      }

    case actions.ADD_NOTATION:
      const newNotation = state[action.gameId].game.moveNotation.map(message => (message))
      newNotation.push(action.notation)
      return {
        ...state,
        [action.gameId]: {
          ...state[action.gameId],
          game: {
            ...state[action.gameId].game,
            moveNotation: newNotation
          }
        }
      }

    case actions.SET_TIMER:
      return {
        ...state,
        [action.gameId]: {
          ...state[action.gameId],
          time: {
            ...state[action.gameId].time,
            [action.timeKey]: { ...state[action.gameId].time[action.timeKey], timerId: action.timerId } 
          }
        }
      }

    case actions.SET_TIME:
      if (action.time < 0) return state
      return {
        ...state,
        [action.gameId]: {
          ...state[action.gameId],
          time: {
            ...state[action.gameId].time,
            [action.timeKey]: { ...state[action.gameId].time[action.timeKey], time: action.time } 
          }
        }
      }

    case actions.REMOVE_PIECE:
      const removeBoard = copyBoard(state[action.gameId].game.board)
      removeBoard[action.position.row][action.position.col] = null
      return {
        ...state,
        [action.gameId]: {
          ...state[action.gameId],
          game: {
            ...state[action.gameId].game,
            board: removeBoard
          }
        }
      }

    default: 
      return state
  }
}

export default gameReducer