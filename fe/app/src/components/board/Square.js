import React from 'react'
import { isPosEqual } from '../../services/helpers'
import { connect } from 'react-redux'
import '../App.css'

const Square = props => {
  const squareColor = isSquareBlack(props.position.col, props.position.row)
  const selected = isPosEqual(props.position, props.selectedPosition)
  const square = props.square
  const piece = square ? square.piece : null
  const squareClasses = `square square-hover ${squareColor ? "light-grey" : ""} ${selected ? "selected" : ""}`
  return (
    <div onClick={() => props.onSquareClick(props.position)} className={squareClasses}>
      {piece ? <img alt={"chess piece"} src={piece.image}/> : ''} 
    </div>
  )
}
    
const isSquareBlack = (col, row) => {
  if (!(row % 2) && col % 2) return true
  if (row % 2 && !(col % 2)) return true
  return false
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id
  return {
    square: state.game[id].game.board[ownProps.position.row][ownProps.position.col],
    selectedPosition: state.game[id].game.selectedSquare
  }
}

export default connect(mapStateToProps, null)(Square)