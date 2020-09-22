export const SET_REGISTER_MODAL = 'SET_REGISTER_MODAL'
export const SET_ACTIVE_ITEM = 'UPDATE_ACTIVE_ITEM'
export const SET_REGISTERING = 'SET_REGISTERING'
export const SET_INVITE_MODAL = 'SET_INVITE_MODAL'
export const SET_ACCEPT_MODAL = 'SET_ACCEPT_MODAL'
export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB'

export const setActiveItem  = (itemValue) => ({ type: SET_ACTIVE_ITEM, itemValue })
export const setRegisterModalOpen = (value) => ({ type: SET_REGISTER_MODAL, value })
export const setRegistering = (value) => ({ type: SET_REGISTERING, value})
export const setInviteModalOpen = (value) => ({ type: SET_INVITE_MODAL, value })
export const setAcceptModalOpen = (value) => ({ type: SET_ACCEPT_MODAL, value })
export const setActiveTab = value => ({ type: SET_ACTIVE_TAB, value })