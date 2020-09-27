import React from 'react'
import { connect } from 'react-redux'
import { setInviteMessage, sendInvite } from '../../actions/user'
import { setInviteModalOpen } from '../../actions/ui'
import { Modal, Button, Form, TextArea } from 'semantic-ui-react'
import UserLabel from '../user/UserLabel'
import '../App.css'

const InviteModal = props => {
  const send = () => {
    const invite = {
      to_user: props.selectedUser.id,
      from_user: props.myId,
      message: props.message
    }
    props.sendInvite(invite)
    props.setMessage('')
    props.setOpen(false)
  }

  const cancel = () => {
    props.setOpen(false)
    props.setMessage('')
  }
  const name = props.selectedUser ? props.selectedUser.name : ''
  const rating = props.selectedUser ? props.selectedUser.rating : ''
  return ( 
    <Modal
      onClose={() => props.setOpen(false)}
      onOpen={() => props.setOpen(true)}
      open={props.open}
    >
      <Modal.Header style={{ textAlign: 'center', width: 'auto' }}>
        Send Invite
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
        </Modal.Description>
        <div style={{ display: "inlineBlock"}}>
          To: <UserLabel style={{width: "auto"}} rating={rating} name={name}/>
        </div>
        <Form>
          <Form.Field
            control={TextArea}
            onChange={(event) => props.setMessage(event.target.value)}
            value={props.message}
            placeholder="Message...."
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={cancel}>
          Cancel
        </Button>
        <Button
          content="Send"
          labelPosition='right'
          icon='checkmark'
          onClick={send}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

const mapStateToProps = state => {
  return {
    selectedUser: state.user.selectedUser,
    open: state.ui.inviteModalOpen,
    message: state.user.inviteMessage,
    myId: state.user.id
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setOpen: value => dispatch(setInviteModalOpen(value)),
    setMessage: value => dispatch(setInviteMessage(value)),
    sendInvite: invite => dispatch(sendInvite(invite))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteModal)