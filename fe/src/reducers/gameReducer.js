import * as actions from '../actions/game'

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



const dummyBoard = () => {
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

/*
const initialState = {
  connected: false,
  id: null,
  board: dummyBoard(),
  moveHistory: [],
  selectedSquare: null,
  myTurn: false,
  validMoves: [],
  myColour: BLACK,
  opponent: null,
  gameStatus: true
}
*/

const initialState = {
  
}


function gameReducer(state = initialState, action) {
  console.log(state)
  switch (action.type) {
    case actions.LOAD_GAME:
      console.log(action.game)
      if (!state[action.game.id]) {
        const newGameObj = {
          status: action.game._status,
          players: action.game.players,
          board: getEmptyBoard
        }
        const newState = { ...state }
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
      return { ...state,  }
    case actions.UPDATE_BOARD:

      return state
    case actions.SET_MY_TURN:
      return { ...state, myTurn: action.value }
    case actions.SELECT_SQUARE:
      
      return { ...state,
        selectedSquare: {
          col: action.position.col,
          row: action.position.row
        }
      }
    
    case actions.SET_COLOUR:
      
      return { ...state, myColour: action.colour }
    case actions.UNSELECT_SQUARE:
      return { ...state, selectedSquare: null }
    case actions.MOVE:
      
      const newState = { 
        ...state, 
        myTurn: false,
        selectedSquare: null,
        board: state.board.map(boardRow => {
          return boardRow.map(squareObj => { 
              if (squareObj) return { piece: { ...squareObj.piece }, moves: squareObj.moves.map((move, moveInd) => ({ ...move }))}
              return null
            })
        })
      }
      const squareToMove = newState.board[action.fromPos.row][action.fromPos.col] 
      newState.board[action.toPos.row][action.toPos.col] = { piece: { ...squareToMove.piece }, moves: squareToMove.moves.map((move, moveInd) => ({ ...move }))}
      newState.board[action.fromPos.row][action.fromPos.col] = null
      
      return newState
     
    case actions.LOAD_VALID_MOVES:
      const boardCopy =  state.board.map(
        boardRow => boardRow.map(
          squareObj => squareObj
            ? { piece: { ...squareObj.piece }, moves: squareObj.moves.map(move => ({ ...move }))}
            : null
        )
      )
      
      for (var i = 0; i < action.validMoves.length; i++) {
        const movesItem = action.validMoves[i]
        boardCopy[movesItem.position.row][movesItem.position.col].moves = movesItem.moves.map(move => ({ ...move }))
      }
      return { 
        ...state, 
        myTurn: false,
        selectedSquare: null,
        board: boardCopy
      }
    case actions.GAME_END:
      return { ...state, gameStatus: action.status}
    default: 
      return state
  }
  return state
}

export default gameReducer