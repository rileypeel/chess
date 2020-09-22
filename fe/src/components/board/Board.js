import React from 'react'
import { connect } from 'react-redux'
import Square from './Square'
import '../App.css'
import { WHITE } from '../../constants/app'
import { isPosIn } from '../../services/helpers'
import { sendMove } from '../../actions/webSocket'
import { move, selectSquare, unselectSquare } from '../../actions/game'

const Board = props => {
  const gameData = props.games[props.id]
  const id = gameData.id
  console.log("game data in board")
  console.log(gameData)
  if (!gameData) {
    return <div></div>
  }
  const onSquareClick = position => {
    //if nothing selected
      // select if it is one of your pieces
    // if piece is seleected 
      // move if it is a valid move
      // else unselect
      const tryToSelect = (square) => {
        if (square) {
          if (gameData.myColour === square.piece.colour)  {
            props.select(position, id)
          }
        }
      }
      const square = gameData.board[position.row][position.col]
      if (!gameData.selectedSquarePosition) {
        tryToSelect(square)
      } else {
        
        if (gameData.myTurn) {
          
          const pieceToMove = gameData.board[gameData.selectedSquarePosition.row][gameData.selectedSquarePosition.col]
          if (isPosIn(position, pieceToMove.moves)) { // seperate this into a seperate function
            
            props.move(gameData.selectedSquarePosition, position, id)
            props.sendMove(gameData.selectedSquarePosition, position, id)
          } else {
            props.unselect(id) //add a select if this position has a piece of yours
            tryToSelect(square)
          }
        } else {
          props.unselect(id)
        }
      }
    }
  var squares = gameData.board.map(
    (boardRow, rowIndex) => boardRow.map((piece, colIndex) => <Square
        key={`r${rowIndex}c${colIndex}`}
        position={{ col: colIndex, row: rowIndex }}
        onSquareClick={(position) => onSquareClick(position)}
        board={gameData.board}
        myColour={gameData.myColour}
        selectedPosition={gameData.selectedSquare}
      />
    )
  )
  if (gameData.myColour === WHITE) {
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
    games: state.game
  }
}

const mapDispatchToProps = dispatch => {
  return {
    select: (position, id) => dispatch(selectSquare(position, id)),
    unselect: id => dispatch(unselectSquare(id)),
    move: (p1, p2, id) => dispatch(move(p1, p2, id)),
    sendMove: (p1, p2, id) => dispatch(sendMove(p1, p2, id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)