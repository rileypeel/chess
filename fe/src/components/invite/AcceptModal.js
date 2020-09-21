import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button, Icon } from 'semantic-ui-react'
import { setAcceptModalOpen } from '../../actions/ui'
import { acceptGameInvite, declineGameInvite } from '../../actions/webSocket'
import '../App.css'

const AcceptModal = props => {

  const acceptClicked = () => {
    props.accept(props.inviteData.id)
    props.setOpen(false)
  }
  const declineClicked = () => {
    props.decline(props.inviteData.id)
    props.setOpen(false)
  }
  return props.open ? ( 
    <Modal
      basic
      onClose={() => props.setOpen(false)}
      onOpen={() => props.setOpen(true)}
      open={props.open}
      size='small'
    >
      <Modal.Header  style={{textAlign: 'center', width: '100%'}}>Accept Invite</Modal.Header>
      <Modal.Content style={{textAlign: 'center'}}>
        <p>From {props.fromUser.name}:</p>
        <p>{props.inviteData ? props.inviteData.message : 'Hey Buddy lets play!'}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color='red' inverted onClick={declineClicked}>
          <Icon name='remove' /> No
        </Button>
        <Button color='green' inverted onClick={acceptClicked}>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  ) : null
}

const mapStateToProps = state => {
  return {
    open: state.ui.acceptModalOpen,
    inviteData: state.user.wsInvite,
    fromUser: state.user.inviteSender

  }
}

const mapDispatchToProps = dispatch => {
  return {
    setOpen: value => dispatch(setAcceptModalOpen(value)),
    accept: inviteId => dispatch(acceptGameInvite(inviteId)),
    decline: inviteId => dispatch(declineGameInvite(inviteId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AcceptModal)