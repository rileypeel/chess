import React from 'react'
import { connect } from 'react-redux'
import { Table, Input, MessageItem } from 'semantic-ui-react'
import { addMessage } from '../../actions/game'
import { sendMessage } from '../../actions/webSocket'
import '../App.css'

const Chat = props => {
  const keyPressed = (e) => {
    if (e.charCode == 13) {
      props.addMessage({ sender: props.me, message: e.target.value }, props.id)
      props.sendMessage(e.target.value, props.id)
      e.target.value = ""
    }
  }
  const messageBox = React.createRef()
  const scrollToBottom = () => {
    //messageBox.current.scrollIntoView({ behaviour: "smooth"}) BUG in here 
  }
  React.useEffect(scrollToBottom, [props.messages])
  const messageDisplay = props.messages.map(message => {
    return (
      <div className="chat-message">
        {message.sender}: {message.message}
      </div>
    )}  
  )
  
  return (
    <div className="chat-container">
      <h1 className="chat-header">Chat</h1>
      <div className="chat-messages">
        {messageDisplay}
        <div ref={messageBox} style={{ height: "0px" }}></div>
      </div>
      <div className="chat-input-container" >
        <input className="chat-input" onKeyPress={keyPressed} placeholder="Send a message...."/>
      </div>
    </div>
    
  )
}

const mapDispatchToProps = dispatch => {
  return {
    addMessage: (message, gameId) => dispatch(addMessage(message, gameId)),
    sendMessage: (message, gameId) => dispatch(sendMessage(message, gameId))
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id
  return {
    messages: state.game[id].game.messages
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)