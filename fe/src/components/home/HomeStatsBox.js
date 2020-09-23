import React from 'react'
import { connect } from 'react-redux'
import { getGameHistory } from '../../actions/user'
import '../App.css'

const HomeStatsBox = props => {
  console.log(props.userId)
  React.useEffect(() => {
    props.getHistory(props.userId)
  }, [props.userId]) //TODO something better here so we dont make api call until I have the userId

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

const mapStateToProps = state => {
  return {
    userId: state.user.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getHistory: (id) => dispatch(getGameHistory(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeStatsBox)