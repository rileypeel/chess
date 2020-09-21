import React from 'react'
import { connect } from 'react-redux'
import { Table, Input } from 'semantic-ui-react'
import '../App.css'


const Chat = (props) => {
  
  let messages = [
    
  ]
  const messageBox = React.createRef()
  const scrollToBottom = () => {
    messageBox.current.scrollIntoView({ behaviour: "smooth"})
  }
  React.useEffect(scrollToBottom, [])
  const tableData = messages.map(message => (
      <div className="chat-message">
        { message.sender }: { message.message }
      </div>
    )  
  )

  return (
    <div className="chat-container">
      <h1 className="chat-header">Chat</h1>
        <div className="chat-messages">
          { tableData }
          <div ref={messageBox}>
            <input className="chat-message-input" placeholder="Send a message...."/>
          </div>
        </div>
    </div>
    
  )



}


const mapStateToProps = (state) => {

  return {
    //messages: state.game.messages
  }
}

export default connect(null, null)(Chat)