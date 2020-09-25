export const isPosEqual = (p1, p2) => {
  return p1.col === p2.col && p1.row === p2.row 
}
  
export const isPosIn = (pos, posArray) => {
  for (var i = 0; i < posArray.length; i++) {
    if (isPosEqual(pos, posArray[i])) {
      return true
    }
  }
  return false
} 

export const isValidMove = (pieceToMove, position) => {
  if (isPosIn(position, pieceToMove.moves)) return true
  if (pieceToMove.passant && isPosEqual(pieceToMove.passant.to, position)) return true
  if (pieceToMove.castle && isPosEqual(pieceToMove.castle.to, position)) return true
}