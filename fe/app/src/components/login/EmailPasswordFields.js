import React from 'react'
import { Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { updateEmailField, updatePasswordField } from '../../actions/user'
import '../App.css'

const EmailPasswordFields = props => (
  <div>
    <Form.Input
      icon="user"
      placeholder="Email"
      type="text"
      value={props.emailValue}
      onChange={(event) => props.updateEmailField(event.target.value)}
    />
    <Form.Input
      icon='lock'
      placeholder="Password"
      type="password"
      value={props.passwordValue}
      onChange={(event) => props.updatePasswordField(event.target.value)}
    />
  </div>
)

const mapStateToProps = state => {
  return {
    emailValue: state.user.authFields.email,
    passwordValue: state.user.authFields.password
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePasswordField: value => dispatch(updatePasswordField(value)),
    updateEmailField: value => dispatch(updateEmailField(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailPasswordFields)