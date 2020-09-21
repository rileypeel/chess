import React from 'react'
import '../App.css'

const Piece = ({ type, selected}) => {
  const colourSymbol = type.colour ? 'Wh' : 'Bl'
  return (
    <div>
      <p className={`${selected ? "blue" : "green"}`}>{colourSymbol}-{ type.symbol }</p>
    </div>
  )
}

export default Piece