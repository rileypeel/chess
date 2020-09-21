import React from 'react'
import { connect } from 'react-redux'
import Square from './Square'
import '../App.css'
import { WHITE } from '../../constants/app'
import { isPosIn } from '../../services/helpers'
import { sendMove } from '../../actions/webSocket'
import { move, selectSquare, unselectSquare } from '../../actions/game'

const Board = props => {
  const onSquareClick = position => {
    //if nothing selected
      // select if it is one of your pieces
    // if piece is seleected 
      // move if it is a valid move
      // else unselect
      const tryToSelect = (square) => {
        if (square) {
          if (props.myColour === square.piece.colour)  {
            props.select(position)
          }
        }
      }
      const square = props.board[position.row][position.col]
      if (!props.selectedSquarePosition) {
        tryToSelect(square)
      } else {
        
        if (props.myTurn) {
          
          const pieceToMove = props.board[props.selectedSquarePosition.row][props.selectedSquarePosition.col]
          if (isPosIn(position, pieceToMove.moves)) { // seperate this into a seperate function
            
            props.move(props.selectedSquarePosition, position)
            props.sendMove(props.selectedSquarePosition, position)
          } else {
            props.unselect() //add a select if this position has a piece of yours
            tryToSelect(square)
          }
        } else {
          props.unselect()
        }
      }
    }
  var squares = props.board.map(
    (boardRow, rowIndex) => boardRow.map((piece, colIndex) => <Square
        key={`r${rowIndex}c${colIndex}`}
        position={{ col: colIndex, row: rowIndex }}
        onSquareClick={(position) => onSquareClick(position)}
      />
    )
  )
  if (props.myColour === WHITE) {
    squares = squares.reverse()
  }
  return (
    <div>
      <div className="board">
        { squares }
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    board: state.game.board,
    myColour: state.game.myColour,
    selectedSquarePosition: state.game.selectedSquare,
    myTurn: state.game.myTurn
  }
}

const mapDispatchToProps = dispatch => {
  return {
    select: position => dispatch(selectSquare(position)),
    unselect: () => dispatch(unselectSquare()),
    move: (p1, p2) => dispatch(move(p1, p2)),
    sendMove: (p1, p2) => dispatch(sendMove(p1, p2))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)