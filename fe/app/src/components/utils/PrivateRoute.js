import React from 'react'
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { fetchUser } from '../../actions/user'
import { LOGIN } from '../../constants/app'

const PrivateRoute = ({ children, getUser, fetchComplete, isAuthenticated, ...rest }) => {
  React.useEffect(() => { 
    getUser()
  }, []) 
  return (
    <Route
      { ...rest }
      render={({ location }) =>
        (isAuthenticated || !fetchComplete) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: LOGIN,
              state: { from: location }
            }}
          />
        )
      }
    />
  )
}

const mapDispatchToProps = dispatch => {
  return {
    getUser: () => dispatch(fetchUser())
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.user.isAuthenticated,
    fetchComplete: state.user.attemptedFetch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)