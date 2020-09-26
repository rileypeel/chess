import React from 'react'
import { connect } from 'react-redux'
import { setTimerId, setTime } from '../../actions/game'
import useInterval from '../../hooks/useInterval'

const Timer = props => {
  
  var run = props.timeRunning
  if (props.time <= 0) {
    run = false
  } 
  useInterval(() => {
    props.setTime(props.time - 1, props.timeKey, props.id)
  }, 1000, run)

  const formatTime = time => {
    const seconds = time % 60
    const minutes = Math.floor(time / 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
  return (
    <h3>{formatTime(props.time)}</h3> 
  )
}
const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id
  const timeKey = ownProps.timeKey
  return {
    time: state.game[id].time[timeKey].time,
    timerId: state.game[id].time[timeKey].timerId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setTime: (time, timeKey, gameId) => dispatch(setTime(time, timeKey, gameId)),
    setTimerId: (timerId, timeKey, gameId) => dispatch(setTimerId(timerId, timeKey, gameId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer)