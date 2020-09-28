import React from 'react'
import { connect } from 'react-redux'
import '../App.css'

const GameStatusBox = props => {
  const moves = []
  var moveNumber = 1
  for (var i = 0; i < props.moves.length; i += 2) { //TODO fix indexes here
    const blackMove = i + 1 < props.moves.length ? props.moves[i+1] : ''
    moves.push(
      <div>
        { moveNumber }: { props.moves[i] } { blackMove }
      </div>
    )
    moveNumber ++
  }
  return (
    <div className="game-status-box">
      <h3>Moves</h3>
      <div className="game-move-box">
        { moves }
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id
  return {
    moves: state.game[id].game.moveNotation
  }
}

export default connect(mapStateToProps, null)(GameStatusBox)