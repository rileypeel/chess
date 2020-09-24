import React from 'react'
import { connect } from 'react-redux'


const Timer = props => {
  console.log(props)
  var time
  React.useEffect(
    () => {
      if (props.runTimer) {
        console.log("in run timer")
        props.setTimerId(setInterval(counter, 1000))
        time = props.time
      } else {
        clearInterval(props.timerId)
      }
    },
    [props.runTimer]
  )
  
  const counter = () => {
    //props.setTime(props.time - 1)
    time = time - 1
  }

  const formatTime = time => {
    const seconds = time % 60
    const minutes = Math.floor(time / 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
  return (
    <h3>{ formatTime(time) }</h3> 
  )

}

export default Timer