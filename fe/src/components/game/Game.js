import React from 'react'
import { connect } from 'react-redux'
import Board from '../board/Board'
import UserLabel from '../user/UserLabel'
import Chat from './Chat'
import GameStatusBox from './GameStatusBox'
import '../App.css'


const Game = props => {
  const gameData = props.games[props.id]
  const opponentData = gameData.opponent.user
  if (!props.gameStatus) {
    
  }
  console.log(gameData)
  return (
    <div className="game-view">
      <div className="board-column">
        <div style={{ marginBottom: "10px", alignItems: "center" }} className="flex-row opponent-label">
          <UserLabel name={opponentData.name} rating={opponentData.rating}/>
          <div style={{ marginLeft: "10px" }}><h3>30:00 </h3></div>
        </div>
        <Board id={props.id}/>
        <div style={{ marginTop: "10px", alignItems: "center" }} className="flex-row my-label">
          <UserLabel name={props.me.name} rating={props.me.rating}/>
          <div style={{ marginLeft: "10px" }}><h3>30:00 </h3></div>
        </div>
      </div>
      <div style={{ height: "fit-content" }} className="status-column grey-box-shadow">
        <GameStatusBox moves={gameData.moveNotation}/>
        <Chat me={props.me.name} opponent={opponentData.name} id={props.id} messages={gameData.messages}/>
        
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    gameStatus: state.game.gameStatus,
    games: state.game,
    me: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)