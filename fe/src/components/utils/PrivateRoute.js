import React from 'react'
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { LOGIN } from '../../constants/app'

const PrivateRoute = ({ children, isAuthenticated, ...rest }) => {
  return (
    <Route
      { ...rest }
      render={({ location }) =>
        isAuthenticated ? (
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

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.user.isAuthenticated
  }
}

export default connect(mapStateToProps, null)(PrivateRoute)