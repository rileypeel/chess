import { CASTLE, EN_PASSANT } from '../constants/app'

export const UNSELECT_SQUARE = 'UNSELECT_SQUARE' 
export const MOVE = 'MOVE'
export const SELECT_SQUARE = 'SELECT_SQUARE'
export const SET_MY_TURN = 'SET_MY_TURN'
export const LOAD_MOVES = 'LOAD_MOVES'
export const LOAD_VALID_MOVES = 'LOAD_VALID_MOVES'
export const SET_COLOUR = 'SET_COLOUR'
export const GAME_END = 'GAME_END'
export const LOAD_GAME = 'LOAD_GAME'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const UPDATE_GAME_STATUS = 'UPDATE_GAME_STATUS'
export const ADD_MESSAGE = 'ADD_MESSAGE'
export const START_GAME = 'START_GAME'
export const ADD_NOTATION = 'ADD_NOTATION'
export const SET_TIMER = 'SET_TIMER'
export const SET_TIME = 'SET_TIME'
export const ADD_CASTLE = 'ADD_CASTLE'
export const ADD_PASSANT = 'ADD_PASSANT'
export const REMOVE_PIECE = 'REMOVE_PIECE'

export const removePiece = (position, gameId) => ({ type: REMOVE_PIECE, position, gameId })
export const setTime = (time, timeKey, gameId) => ({ type: SET_TIME, time, timeKey, gameId })
export const setTimerId = (timerId, timeKey, gameId) => ({ type: SET_TIMER, timerId, timeKey, gameId })
export const updateBoard = gameId => ({ type: UPDATE_BOARD, gameId })
export const loadGame = (game, me, opponent) => ({ type: LOAD_GAME, game, me, opponent })
export const setMyColour = (colour, gameId) => ({ type: SET_COLOUR, colour, gameId})
export const selectSquare = (position, gameId) => ({ type: SELECT_SQUARE, position, gameId })
export const movePiece = (fromPos, toPos, gameId) => ({ type: MOVE, fromPos, toPos, gameId })
export const setMyTurn = (value, gameId) => ({ type: SET_MY_TURN, value, gameId })
export const unselectSquare = gameId => ({ type: UNSELECT_SQUARE, gameId })
export const loadValidMoves = (validMoves, gameId) => ({ type: LOAD_VALID_MOVES, validMoves, gameId })
export const loadMoves = (moves, gameId) => ({ type: LOAD_MOVES, moves, gameId })
export const updateGameStatus = (status, gameId) => ({ type: UPDATE_GAME_STATUS, status, gameId })
export const addMessage = (message, gameId) => ({ type: ADD_MESSAGE, message, gameId })
export const startGame = (game, me, opponent) => ({ type: START_GAME, game, me, opponent })
export const addMoveNotation = (notation, gameId) => ({ type: ADD_NOTATION, notation, gameId })
export const addCastle = (move, gameId) => ({ type: ADD_CASTLE, move, gameId })
export const addPassant = (move, gameId) => ({ type: ADD_PASSANT, move, gameId })

export const move = (pieceToMove, fromPos, toPos, moveType, gameId) => {
  return dispatch => {
    if (moveType == CASTLE) {
      dispatch(movePiece(pieceToMove.castle.rookFrom, pieceToMove.castle.rookTo, gameId))
    } else if (moveType == EN_PASSANT) {
      dispatch(removePiece(pieceToMove.passant.capture, gameId))
    } 
    console.log(gameId)
    dispatch(movePiece(fromPos, toPos, gameId))
  }
}