import React from 'react'
import Piece from './Piece'
import { connect } from 'react-redux'
import { selectPiece, unselectPiece, moveSelectedPiece } from '../../actions/game'
import '../App.css'

const Square = props => {
  const squareColor = isSquareBlack(props.position.col, props.position.row)
  const selected = isSquareSelected(props.position, props.selectedPosition) //Use isPosEqual
  const square = props.board[props.position.row][props.position.col]
  const piece = square ? square.piece : null
  
  const squareClasses = `square square-hover ${squareColor ? "light-grey" : ""} ${selected ? "selected" : ""}`
  return (
    <div onHover onClick={() => props.onSquareClick(props.position)} className={squareClasses}>
      { piece ? <img src={piece.image}/> : '' } 
    </div>
  )
}
    
const isSquareBlack = (col, row) => {
  if (!(row % 2)) { 
    if (col % 2) {
      return true
    }
  } else {
    if (!(col % 2)){
      return true
    }
  }
  return false
}

const isSquareSelected = (position, selectedPosition) => {
  if (!selectedPosition) return false
  
  return (position.col === selectedPosition.col && position.row === selectedPosition.row)
}



const mapDispatchToProps = (dispatch) => {
  return {
    //select: (position) => dispatch(selectPiece(position)),
    //unselect: () => dispatch(unselectPiece())
  }
}

export default connect(null, mapDispatchToProps)(Square)