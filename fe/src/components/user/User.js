import React from 'react'
import { connect } from 'react-redux'
import '../App.css'

const User = props => (
  <div className="view">
    <h1>This is the User</h1>
    { props.user ? <h1>{props.user.name}</h1> : null }
  </div>
)

const mapStateToProps = state => {
  return {
    user: state.user.user
  }
}

export default connect(mapStateToProps)(User)