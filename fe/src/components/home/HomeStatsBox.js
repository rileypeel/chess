import React from 'react'
import { connect } from 'react-redux'
import '../App.css'

const HomeStatsBox = props => {

  const fakeGames = [{ opponent: 'guy', winner: true }, { opponent: 'girl', winner: false }]

  var totalWins = 0
  const gamesPlayed = fakeGames.length
  

  const results = fakeGames.map(
    gameResult => {
      if (gameResult.winner) totalWins++
      return (<div className="flex-row" style={{ justifyContent: "space-between", margin: "5px" }}>
        <div>
          { gameResult.winner ? 'Win' : 'Loss' }
        </div>
        <div>
          Game Vs. { gameResult.opponent }
        </div>
      </div>
    )}
  )

  return (
    <div className="stats-box grey-box-shadow">
      <h3>Wins: { totalWins } Losses: { gamesPlayed - totalWins }</h3>
      { results }
    </div>
  )
}

export default connect(null, null)(HomeStatsBox)