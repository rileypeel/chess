import React from 'react'
import { connect } from 'react-redux'
import { getGameHistory } from '../../actions/user'
import { Loader } from 'semantic-ui-react'
import '../App.css'

const HomeStatsBox = props => {
  React.useEffect(() => {
    if (props.userId) {
      props.getHistory(props.userId)
    }
  }, [props.userId])

  const results = props.gameHistory && props.gameHistory.map(
    (gameResult, index) => {
      return (<div key={index} className="flex-row" style={{ justifyContent: "space-between", margin: "5px" }}>
        <div>
          { gameResult.won ? 'Win' : 'Loss' }
        </div>
        <div>
          Game Vs. { gameResult.opponent }
        </div>
      </div>
      )
    }
  )
  return (
    <div className="stats-box grey-box-shadow">
      {props.gameHistory ? (
        <div>
          <h3>Wins: {props.wins} Losses: {props.gamesPlayed - props.wins}</h3>
          <div className='game-display'>
            {results}
          </div>
        </div>
      ) : (<Loader inline={'centered'} active/>) 
      }
    </div>
  )
}

const mapStateToProps = state => {
  return {
    userId: state.user.id,
    gameHistory: state.user.gameHistory,
    wins: state.user.totalWins,
    gamesPlayed: state.user.totalGames
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getHistory: (id) => dispatch(getGameHistory(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeStatsBox)