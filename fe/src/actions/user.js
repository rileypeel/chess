import api from '../services/api'
import { setRegistering, setRegisterModalOpen } from './ui'
import { notify } from '../services/notification'

export const FETCH_USER = 'FETCH_USER'
export const LOGIN_USER = 'LOGIN_USER'
export const LOGOUT_USER = 'LOGIN_USER'
export const REGISTER_USER = 'REGISTER_USER'
export const UPDATE_EMAIL_FIELD = 'UPDATE_EMAIL_FIELD'
export const UPDATE_PASSWORD_FIELD = 'UPDATE_PASSWORD_FIELD'
export const UPDATE_USERNAME_FIELD = 'UPDATE_USERNAME_FIELD'
export const CLEAR_AUTH_FIELDS = 'CLEAR_AUTH_FIELDS'
export const LOAD_INVITES = 'LOAD_INVITES'
export const SAVE_INVITE = 'SAVE_INVITE'
export const SET_INVITE_SENDER = 'SET_INVITE_SENDER'
export const START_SEARCH = 'START_SEARCH'
export const FINISH_SEARCH = 'FINISH_SEARCH'
export const SET_INVITE_MESSAGE = 'SET_INVITE_MESSAGE'
export const SET_SELECTED_USER = 'SET_SELECTED_USER'
export const SET_ATTEMPTED_FETCH = 'SET_ATTEMPTED_FETCH'
export const SET_HISTORY = 'SET_HISTORY'

export const updateEmailField = (value) => ({ type: UPDATE_EMAIL_FIELD, value })
export const updatePasswordField = (value) => ({ type: UPDATE_PASSWORD_FIELD, value })
export const updateUsernameField = (value) => ({ type: UPDATE_USERNAME_FIELD, value })
export const clearAuthFields = () => ({ type: CLEAR_AUTH_FIELDS })
export const setInviteSender = user => ({ type: SET_INVITE_SENDER, user })
export const saveInvite = invite => ({ type: SAVE_INVITE, invite })
export const setSelectedUser = (value) => ({ type: SET_SELECTED_USER, selectedUser: value })
export const setInviteMessage = (value) => ({ type: SET_INVITE_MESSAGE, value })
export const setAttemptedFetch = value => ({ type: SET_ATTEMPTED_FETCH, value })
export const setHistory = response => ({ type: SET_HISTORY, ...response })

export function getGameHistory(userId) {
  return dispatch => {
    return api.fetchGameHistory(userId).then(response => {
      dispatch(setHistory(response))
    })
  }
}
export function fetchUser() {
  return dispatch => {
    return api.fetchUser()
      .then(response => {
        dispatch({ type: LOGIN_USER, ...response })
        dispatch(setAttemptedFetch(true))
      })
  }
}

export function loginUser(userCredentials) {
  return dispatch => {
    return api.loginUser(userCredentials)
      .then(response => {
        dispatch({ type: LOGIN_USER, ...response })
        if (!response.id) {
          notify("Error", "Login Failed", { type: "danger" })
        }
      })
  }
}
  
export function logoutUser() {
  return dispatch => {
    return api.logoutUser()
      .then(() => dispatch({ type: LOGOUT_USER }))
  }
}

export function registerUser(user) {
  return dispatch => {
    return api.registerUser(user)
      .then(status => {
        if (status === 201) {
          dispatch({ type: REGISTER_USER, status })
          dispatch({ type: CLEAR_AUTH_FIELDS })
          dispatch(setRegisterModalOpen(false))
          notify("Success", "Account Created", { animation: "slide" })
        } else {
          notify("Error", "Registration Failed", { type: "danger", animation: "slide" })
        }
        dispatch(setRegistering(false))
      }).catch((e) => {
        dispatch(setRegistering(false))
        notify("Error", "Registration Failed", { type: "danger", animation: "slide" })
      })
  }
}

export function loadGameInvites(user_id) {
  return dispatch => {
    return api.retrieveInvites(user_id)
      .then(data => {
        return { type: LOAD_INVITES, data}
      })
  }
}

export const search = (searchStr) => {
  return dispatch => {
    dispatch({ type: START_SEARCH, value: searchStr, loading: true })
    return api.searchUser(searchStr)
      .then(responseObj => {
        dispatch({ type: FINISH_SEARCH, results: responseObj, loading: false })
      })
  }
}

export const sendInvite = (inviteObj) => {
  return dispatch => {
    return api.sendInvite(inviteObj).then((status) => {
      if (status == 201) {
        //success notification
        //close modal and clear fields
      } else {
      
        //error notification
      }
    })
  }
}