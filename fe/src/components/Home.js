import React from 'react'
import { connect } from 'react-redux'
import GameInvite from './invite/GameInvite'
import './App.css' 

const Home = () => {
  console.log(document.cookie)
  return (
    <div className="view">
      <GameInvite/>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    name: state.name
  }
}


export default connect(mapStateToProps)(Home)