import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Modal, Grid, Message} from 'semantic-ui-react'
import EmailPasswordFields from './EmailPasswordFields'
import { setRegistering, setRegisterModalOpen} from '../../actions/ui' 
import { registerUser, updateUsernameField, clearAuthFields } from '../../actions/user'
import '../App.css'

const RegisterModal = props => {
  const closeModal = () => {
    props.clearFields()
    props.setOpen(false)
  }
  const createClicked = () => {
    props.setRegistering(true)
    props.registerUser(props.registerFields)
  }
  return (
    <Modal
      style={{textAlign: 'center'}}
      onClose={closeModal}
      onOpen={() => props.setOpen(true)}
      open={props.open}
    >
      <Modal.Header style={{ width: 'auto' }}>Create an Account</Modal.Header>
      <Modal.Content>
        <Grid className="center aligned">
          <Form style={{ width: '300px' }}>
            <Form.Input
              icon="user"
              placeholder="Username"
              type="text"
              value={props.registerFields.name}
              onChange={(event) => props.setUsernameField(event.target.value)}
            />
            <EmailPasswordFields/>
          </Form>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button disabled={props.registering} color='black' onClick={closeModal}>
          Cancel
        </Button>
        <Button
          loading={props.registering}
          content="Create"
          labelPosition='right'
          icon='checkmark'
          onClick={createClicked}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

const mapStateToProps = state => {
  return {
    open: state.ui.registerModalOpen,
    registerFields: state.user.authFields,
    registering: state.ui.registering,
    registerResult: state.user.registerResult
  }
} 

const mapDispatchToProps = dispatch => {
  return {
    setOpen: value => dispatch(setRegisterModalOpen(value)),
    registerUser: registerFields => dispatch(registerUser(registerFields)),
    setRegistering: value => dispatch(setRegistering(value)),
    setUsernameField: value => dispatch(updateUsernameField(value)),
    clearFields: () => dispatch(clearAuthFields())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterModal)