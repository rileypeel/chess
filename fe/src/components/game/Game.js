import React from 'react'
import { connect } from 'react-redux'
import Board from '../board/Board'
import UserLabel from '../user/UserLabel'
import Chat from './Chat'
import GameStatusBox from './GameStatusBox'
import '../App.css'

const Game = props => {
  const gameData = props.games[props.id]
  if (!props.gameStatus) {
    
  }
  
  return (
    <div className="view">
      <h1>Game</h1>
      <div style={{margin: '10px'}}>
        <UserLabel name={"Poo"} rating={2000}/>
      </div>
      <div style={{ float: "left" }}>
        <Board />
      </div>
      <Chat/>
      <GameStatusBox/>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    gameStatus: state.game.gameStatus,
    games: state.game
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)