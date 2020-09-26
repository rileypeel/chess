import * as actions from '../actions/ui'

const initialState = {
  activeItem: null,
  registerModalOpen: false,
  registering: false,
  inviteModalOpen: false,
  acceptModalOpen: false,
  activeTab: null,
  tabNumbers: null,
  goToGame: null
}

function uiReducer(state=initialState, action) {
    switch (action.type) {
      case actions.SET_ACTIVE_ITEM:
        return { ...state, activeItem: action.itemValue }
      case actions.SET_REGISTER_MODAL:
        return { ...state, registerModalOpen: action.value }
      case actions.SET_REGISTERING:
        return { ...state, registering: action.value }
      case actions.SET_INVITE_MODAL:
        return { ...state, inviteModalOpen: action.value }
      case actions.SET_ACCEPT_MODAL:
        return { ...state, acceptModalOpen: action.value }
      case actions.SET_GO_TO_GAME:
        console.log(action)
        return { ...state, goToGame: action.gameId }
      default:
        return state
    }
}

export default uiReducer