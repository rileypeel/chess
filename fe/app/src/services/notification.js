import { store } from 'react-notifications-component'
import * as constants from '../constants/app'

const getAnimationIn = (type) => {
  if (type === 'slide') {
    return "animate__slideInRight"
  } else if (type === 'fade') {
    return "animate__fadeIn"
  }
}

const getAnimationOut = (type) => {
  if (type === 'slide') {
    return "animate__slideOutRight"
  } else if (type === 'fade') {
    return "animate__fadeOut"
  }
}

export const notify = (title, message, extraArgs) => {
  const { container = "top-right", type = "success", animation = "fade", duration = 5000, onRemoval = null} = extraArgs
  store.addNotification({
    title,
    message,
    type,
    onRemoval,
    insert: "top",
    container,
    animationIn: ["animate__animated", getAnimationIn(animation)],
    animationOut: ["animate__animated", getAnimationOut(animation)],
    dismiss: {
      duration
    }
  })
}

export const endGameNotify = (winner, type, callback) => {
  var title = 'You lost :('
  var message = ''
  var notifType = 'danger'
  if (winner) {
    title = 'You won!'
    notifType = 'success'
  }
  if (type === constants.CHECKMATE) {
    if (winner) message = 'You have mated your opponent!'
    else message = 'You are in checkmate...'
  } else if (type === constants.STALEMATE) {
    title = 'Draw'
    message = 'You are in stalemate'
  } else if (type === constants.RESIGN) {
    if (winner) message = 'Your opponent has resigned'
    else message = 'You have resigned.'
  } else if (type === constants.TIMEOUT) {
    if (winner) message = 'Your opponent has ran out of time.'
    else message = 'You have ran out of time.'
  }
  store.addNotification({
    title,
    message,
    type: notifType,
    insert: "top",
    container: "center",
    animationIn: ["animate__animated", "animate__zoomIn"],
    animationOut: ["animate__animated", "animate__zoomOut"],
    dismiss: {
      duration: 10000
    },
    onRemoval: callback
  })
}