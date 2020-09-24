import * as actions from '../actions/game'
import { setActiveItem } from '../actions/ui'

import { pieces, BLACK, WHITE } from '../constants/app'

//helpers move these somewhere else
/*
const isPosEqual = (p1, p2) => {
  
  if (p1.length != p2.length) {
    return false
  }
  for (var i = 0;i < p1.length; i++) {
    if (p1[i] != p2[i]) {
      return false
    }
  }
  return true
}

const isPosIn = (pos, posArray) => {

  for (var i = 0; i < posArray.length; i++) {
    if (isPosEqual(pos, posArray[i])) {
      return true
    }
  }
  return false
}
*/
// move format = { from: { col: 0, row: 0 }, to: { col: 0, row: 0 }}

const posToObj = position => {

}



const startingBoard = () => {
  var board = [[
    { piece: pieces.whiteRook, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whiteKnight, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whiteBishop, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whiteQueen, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whiteKing, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whiteBishop, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whiteKnight, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whiteRook, moves: [{col: 0, row: 4}, {col: 0, row: 5}] }, 
  ]]
  board.push([
    { piece: pieces.whitePawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whitePawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whitePawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whitePawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whitePawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whitePawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whitePawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.whitePawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] }, 
  ])
  for (var i = 0; i < 4; i++) {
    board.push([null, null, null, null, null, null, null, null])
  }
  board.push([
    { piece: pieces.blackPawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackPawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackPawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackPawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackPawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackPawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackPawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackPawn, moves: [{col: 0, row: 4}, {col: 0, row: 5}] }, 
  ])
  board.push([
    { piece: pieces.blackRook, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackKnight, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackBishop, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackQueen, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackKing, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackBishop, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackKnight, moves: [{col: 0, row: 4}, {col: 0, row: 5}] },
    { piece: pieces.blackRook, moves: [{col: 0, row: 4}, {col: 0, row: 5}] }, 
  ])
  return board
}

const getEmptyBoard = () => {
  const emptyBoard = []
  for (var i = 0; i < 8; i++) {
    emptyBoard.push([])
    for (var j = 0; j < 8; j++) {
      emptyBoard[i].push(null)
    }
  }
  return emptyBoard
}

/*
export const UNSELECT_SQUARE = 'UNSELECT_SQUARE' 
export const MOVE = 'MOVE'
export const SELECT_SQUARE = 'SELECT_SQUARE'
export const SET_MY_TURN = 'SET_MY_TURN' d 
export const LOAD_MOVES = 'LOAD_MOVES' d
export const LOAD_VALID_MOVES = 'LOAD_VALID_MOVES' d
export const SET_COLOUR = 'SET_COLOUR'
export const GAME_END = 'GAME_END' 
export const LOAD_GAME = 'LOAD_GAME' d 
export const UPDATE_BOARD = 'UPDATE_BOARD' d
export const UPDATE_GAME_STATUS = 'UPDATE_GAME_STATUS' d
export const ADD_MESSAGE = 'ADD_MESSAGE'
*/

// Helper functions for copying state 

const copyMoves = moves => (moves.map(move => ({ ...move })))  

const copyBoard = board => (
  board.map(
    row => row.map(
      square => (
        square//square ? { piece: { ...square.piece }, moves: square.moves } : null
      )
    )
  )
)

const copyGame = game => {
  const newGame = {
    ...game,
    board: copyBoard(game.board),
    moveHistory: copyMoves(game.moveHistory),
    selectedSquare: game.selectedSquare ? { ...game.selectedSquare } : null,
    opponent: game.opponent ? { ...game.opponent, user: { ...game.opponent.user } } : null,
    messages: game.messages.map(message => ({ ...message })),
    moveNotation: game.moveNotation.map(move => (move))
  }
  return newGame
}

const copyState = state => {
  const newState = {}
  for (const key in state) {
    newState[key] = copyGame(state[key])
  }
  return newState
}

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
            time: { me: { time: 1800 } } //TODO
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
    case actions.START_GAME: //TODO refactor with load game
      if (!state[action.game.id]) {
        const newGame = getInitialGameState()
        newGame.status = action.game._status
        newGame.myColour = action.me.colour
        newGame.opponent = { ...action.opponent, user: { ...action.opponent.user } }
        newGame.id = action.game.id
        return { ...state,
          [action.game.id]: {
            game: newGame,
            time: { me: { time: 1800 } } //TODO
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
      console.log("in move")
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
      const validMoveBoard = copyBoard(state[action.gameId].game.board)
      action.validMoves.forEach(item => {
        validMoveBoard[item.position[1]][item.position[0]] = {
          ...state[action.gameId].game.board[item.position[1]][item.position[0]],
          moves: item.moves.map(
              move => (
                { col: move[0], row: move[1] }
              )
            ),
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
      return state //TODO

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

    default: 
      return state
  }
  return state
}

export default gameReducer