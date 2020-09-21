import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import { loginUser, logoutUser, fetchUser } from '../../actions/user'
import { HOME } from '../../constants/app'
import { setRegisterModalOpen} from '../../actions/ui'
import EmailPasswordFields from './EmailPasswordFields'
import '../App.css'
import RegisterModal from './RegisterModal'
import Logo from './Logo'
import 'react-notifications-component/dist/theme.css'
import 'animate.css'

const Login = props => {
  
  React.useEffect(() => { 
    props.getUser()
  }, [])  


  const history = useHistory()
  if (props.isAuthenticated) {
    history.push(HOME)
  }
  return (
    <div class="login-page"> 
      <div className="login-box">
        <div className="form">
          <Form>
            <EmailPasswordFields/>
          </Form>
          <button id="login-button" className="ui button" onClick={() => props.login(props.loginCredentials)}>
            Login
          </button>
          <button id="create-button" className="ui button" onClick={() => props.setModalOpen(true)}>
            Create Account
          </button>
          <RegisterModal/>
        </div>
      </div>
        <Logo/>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    loginCredentials: state.user.authFields,
    isAuthenticated: state.user.isAuthenticated
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: userCredentials => {
      dispatch(loginUser(userCredentials))
    },
    logout: () => {
      dispatch(logoutUser())
    },
    setModalOpen: value => dispatch(setRegisterModalOpen(value)),
    getUser: () => dispatch(fetchUser())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)