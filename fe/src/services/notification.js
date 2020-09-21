import { store } from 'react-notifications-component'

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
  const { type = "success", animation = "fade", duration = 5000, onRemoval = null} = extraArgs
  store.addNotification({
    title,
    message,
    type,
    onRemoval,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", getAnimationIn(animation)],
    animationOut: ["animate__animated", getAnimationOut(animation)],
    dismiss: {
      duration
    }
  })
}