import React from 'react'
import { connect } from 'react-redux'
import '../App.css'

const GameStatusBox = props => {
  
  const fakeMoves = ['ke5', 'pxe6', 'Kh1']
  const moves = []
  var moveNumber = 1
  for (var i = 0; i < fakeMoves.length; i += 2) { //TODO fix indexes here
    moves.push(<MoveRow moveNumber={ moveNumber } moveOne={ fakeMoves[i] } moveTwo={ fakeMoves[i] }/>)
    moveNumber ++
  }

  return (
    <div className="game-status-box">
      <div className="game-move-box">
        { moves }
      </div>
    </div>
  )
}

const MoveRow = props => (
  <div className="">
    { props.moveNumber }: { props.moveOne } { props.moveTwo }
  </div>
)

export default connect(null, null)(GameStatusBox)