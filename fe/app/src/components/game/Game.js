import React from 'react'
import { connect } from 'react-redux'
import { Confirm } from 'semantic-ui-react'
import { updateTimes, sendResign } from '../../actions/webSocket'
import { confirmResign } from '../../actions/game'
import Board from '../board/Board'
import UserLabel from '../user/UserLabel'
import Chat from './Chat'
import GameStatusBox from './GameStatusBox'
import Timer from './Timer'
import '../App.css'

const Game = props => {
  React.useEffect(() => {
    props.updateTimes(props.id)
  }, [])

  return (
    <div className="game-view">
      <div className="board-column">
        <div style={{ marginBottom: "10px", alignItems: "center" }} className="flex-row opponent-label">
          <UserLabel name={props.opponent.user.name} rating={props.opponent.user.rating}/>
          <div style={{ marginLeft: "10px" }}>
          <Timer timeKey={'opponent'} id={props.id} timeRunning={!props.myTurn && !props.gameOver}/>
          </div>
          
        </div>
        <Board id={props.id}/>
        <div style={{ marginTop: "10px", alignItems: "center" }} className="flex-row my-label">
          <UserLabel name={props.me.name} rating={props.me.rating}/>
          <div style={{ marginLeft: "10px" }}>
            <Timer timeKey={'me'} id={props.id} timeRunning={props.myTurn}/>
          </div>
            <button style={{ marginLeft: '10px' }} className="ui button" onClick={() => props.setConfirm(true, props.id)}>
              Resign
            </button>
            <Confirm
              open={props.confirmOpen}
              onCancel={() => props.setConfirm(false, props.id)}
              onConfirm={() => {
                props.sendResign(props.id)
                props.setConfirm(false, props.id)
              }}
            />
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
    myTurn: state.game[id].game.myTurn,
    gameStatus: state.game[id].game.gameStatus,
    opponent: state.game[id].game.opponent,
    me: state.user,
    confirmOpen: state.game[id].game.confirmResignOpen,
    gameOver: state.game[id].game.gameOver
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateTimes: gameId => dispatch(updateTimes(gameId)),
    sendResign: gameId => dispatch(sendResign(gameId)),
    setConfirm: (value, gameId) => dispatch(confirmResign(value, gameId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)