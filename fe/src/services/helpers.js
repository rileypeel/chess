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
  