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
        square ? { piece: { ...square.piece }, moves: copyMoves(square.moves) } : null
      )
    )
  )
)

const copyGame = game => {
  const newGame = {
    ...game,
    board: copyBoard(game.board),
    moveHistory: copyMoves(game.moveHistory),
    opponent: { ...game.opponent },
    selectedSquare: { ...game.selectedSquare },
    opponent: { ...game.opponent, user: { ...game.opponent.user } }
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
  selectedSquare: null,
  myTurn: false,
  myColour: BLACK,
  me: null,
  opponent: null,
  gameStatus: true
})

const initialState = {
  
}


function gameReducer(state = {}, action) {
  const newState = copyState(state)
  switch (action.type) {
    case actions.LOAD_GAME:
      if (!state[action.game.id]) {
        const newGameObj = getInitialGameState()
        newGameObj.status = action.game._status
        newGameObj.myColour = action.me.colour
        newGameObj.myTime = action.me.time
        newGameObj.opponent = { ...action.opponent, user: { ...action.opponent.user } }
        newGameObj.id = action.game.id
        newState[action.game.id] = newGameObj
        return newState
      }
      return state

    case actions.LOAD_MOVES:
      const moves = action.moves.map((moveItem) => {
        return {
          from: { row: moveItem.from[1], col: moveItem.from[0] },
          to: { row: moveItem.to[1], col: moveItem.to[0] }
        }
      })
      newState[action.gameId].moveHistory = moves //TODO
      return newState

    case actions.START_GAME:
      if (!state[action.game.id]) {
        const newGameObj = getInitialGameState()
        newGameObj.status = action.game._status
        newGameObj.myColour = action.me.colour
        newGameObj.myTime = action.me.time
        newGameObj.opponent = { ...action.opponent, user: { ...action.opponent.user } }
        newGameObj.id = action.game.id
        newState[action.game.id] = newGameObj
        return newState
      }
      return state
    
    case actions.SET_MY_TURN:
      newState[action.gameId].myTurn = action.value
      return newState

    case actions.SELECT_SQUARE:
      newState[action.gameId].selectedSquare = {
        col: action.position.col,
        row: action.position.row
      }
      return newState
    
    case actions.SET_COLOUR:
      newState[action.gameId].myColour = action.colour
      return newState

    case actions.UNSELECT_SQUARE:
      newState[action.gameId].selectedSquare = null
      return newState

    case actions.MOVE:
      const squareToMove = newState.board[action.fromPos.row][action.fromPos.col] 
      newState.board[action.toPos.row][action.toPos.col] = { piece: { ...squareToMove.piece }, moves: []}
      newState.board[action.fromPos.row][action.fromPos.col] = null
      return newState
     
    case actions.LOAD_VALID_MOVES:
      for (var i = 0; i < action.validMoves.length; i++) {
        const movesItem = action.validMoves[i]
        newState[action.gameId].board[movesItem.position.row][movesItem.position.col].moves = movesItem.moves.map(move => ({ ...move }))
      }
      return newState
    

    case actions.GAME_END:
      return state //TODO
    default: 
      return state
  }
  return state
}

export default gameReducer