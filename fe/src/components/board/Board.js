import React, { isValidElement } from 'react'
import { connect } from 'react-redux'
import Square from './Square'
import '../App.css'
import { WHITE } from '../../constants/app'
import { isValidMove } from '../../services/helpers'
import { sendMove } from '../../actions/webSocket'
import { move, selectSquare, unselectSquare } from '../../actions/game'

const Board = props => {
  const gameData = props.game
  const onSquareClick = position => {
      const tryToSelect = (square) => {
        if (square) {
          if (gameData.myColour === square.piece.colour)  {
            props.select(position, props.id)
          }
        }
      }
      const square = gameData.board[position.row][position.col]
      if (!gameData.selectedSquare) {
        tryToSelect(square)
      } else {
        if (gameData.myTurn) {
          const pieceToMove = gameData.board[gameData.selectedSquare.row][gameData.selectedSquare.col]
          const moveType = isValidMove(pieceToMove, position)
          if (moveType) {  
            props.move(pieceToMove, gameData.selectedSquare, position, moveType, props.id)
            props.sendMove(gameData.selectedSquare, position, props.id)
            props.unselect(props.id)
          } else {
            props.unselect(props.id)
            tryToSelect(square)
          }
        } else {
          props.unselect(props.id)
        }
      }
    }
  var squares = gameData.board.map(
    (boardRow, rowIndex) => boardRow.map((piece, colIndex) => <Square
        key={`r${rowIndex}c${colIndex}`}
        position={{ col: colIndex, row: rowIndex }}
        onSquareClick={(position) => onSquareClick(position)}
        myColour={gameData.myColour}
        id={props.id}
      />
    )
  )
  if (gameData.myColour === WHITE) {
    squares = squares.reverse()
  }
  return (
    <div>
      <div className="board">
        {squares}
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id
  return {
    game: state.game[id].game
  }
}

const mapDispatchToProps = dispatch => {
  return {
    select: (position, id) => dispatch(selectSquare(position, id)),
    unselect: id => dispatch(unselectSquare(id)),
    move: (piece, p1, p2, type, id) => dispatch(move(piece, p1, p2, type, id)),
    sendMove: (p1, p2, id) => dispatch(sendMove(p1, p2, id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)