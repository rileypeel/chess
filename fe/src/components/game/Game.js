import React from 'react'
import { connect } from 'react-redux'
import Board from '../board/Board'
import UserLabel from '../user/UserLabel'
import Chat from './Chat'
import GameStatusBox from './GameStatusBox'
import { setMyTimerId, setMyTime } from '../../actions/game'
import Timer from './Timer'
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
          <div style={{ marginLeft: "10px" }}></div>
        </div>
        <Board id={props.id}/>
        <div style={{ marginTop: "10px", alignItems: "center" }} className="flex-row my-label">
          <UserLabel name={props.me.name} rating={props.me.rating}/>
          <div style={{ marginLeft: "10px" }}>
            <Timer
              timerId={gameData.myTimerId}
              setTimerId={props.setMyTimerId(props.id)}
              time={gameData.myTime}
              runTimer={gameData.myTurn}
              setTime={props.setMyTime(props.id)}
            />
          </div>
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
    setMyTimerId: gameId => timerId => dispatch(setMyTimerId(timerId, gameId)),
    setMyTime: gameId => time => dispatch(setMyTime(time, gameId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)