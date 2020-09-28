import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { connectWS} from '../../actions/webSocket'
import { WS_HOST} from '../../constants/app'

const WebSocketConnection = (props) => {

  useEffect(() => {
    props.connectWS(WS_HOST)
  }, [])
  return (
    <div>{ props.children }</div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    connectWS: (host) => dispatch(connectWS(host))
  }
}

const mapStateToProps = (state) => {
  return {
    connected: state.ws.connected,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WebSocketConnection)