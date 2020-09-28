import { combineReducers } from 'redux'
import userReducer from './userReducer'
import gameReducer from './gameReducer'
import uiReducer from './uiReducer'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import socketReducer from './wsReducer'
import socketMiddleware from '../middleware/wsMiddleware'

const chessAppReducer = combineReducers({
  game: gameReducer,
  user: userReducer,
  ui: uiReducer,
  ws: socketReducer
})

export default createStore(
  chessAppReducer,
  applyMiddleware(thunk, socketMiddleware)
)