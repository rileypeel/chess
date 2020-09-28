import * as actions from '../actions/webSocket'

const initialState = {
  connected: false,
}

function mainSocketReducer(state = initialState, action) {

  switch(action.type) {
    case actions.WS_CONNECTED:
      return { ...state, connected: true }
    default:
      return state
  }
}

export default mainSocketReducer