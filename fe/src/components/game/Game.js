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
  if (!props.gameStatus) {
  }
  return (
    <div className="game-view">
      <div className="board-column">
        <div style={{ marginBottom: "10px", alignItems: "center" }} className="flex-row opponent-label">
          <UserLabel name={props.opponent.user.name} rating={props.opponent.user.rating}/>
          <div style={{ marginLeft: "10px" }}></div>
        </div>
        <Board id={props.id}/>
        <div style={{ marginTop: "10px", alignItems: "center" }} className="flex-row my-label">
          <UserLabel name={props.me.name} rating={props.me.rating}/>
          <div style={{ marginLeft: "10px" }}>
        
          </div>
        </div>
      </div>
      <div style={{ height: "fit-content" }} className="status-column grey-box-shadow">
        <GameStatusBox id={props.id}/>
        <Chat me={props.me.name} id={props.id}/>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id
  return {
    gameStatus: state.game[id].game.gameStatus,
    opponent: state.game[id].game.opponent,
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