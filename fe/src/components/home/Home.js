import React from 'react'
import { connect } from 'react-redux'
import GameInvite from '../invite/GameInvite'
import UserLabel from '../user/UserLabel'
import HomeStatsBox from './HomeStatsBox'
import '../App.css' 
import { setGoToGame } from '../../actions/ui'
import { useHistory } from 'react-router-dom'
import { GAME } from '../../constants/app'

const Home = props => {
  const history = useHistory()
  React.useEffect(() => {
    if (props.goToGame) {
      props.setGoToGame(false)
      history.push(GAME)
    }
  }, [props.goToGame])
  return (
    <div className="home-view">
      <div className="home-margin-top invite-column">
        <GameInvite/>
      </div>
      <div className="home-label">
        <UserLabel size={'huge'} name={props.name} rating={props.rating}/>
      </div>
      <div className="home-margin-top stats-column">
        <h3>Player Stats</h3>
        <HomeStatsBox/>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    name: state.user.name,
    rating: state.user.rating,
    goToGame: state.ui.goToGame
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setGoToGame: value => dispatch(setGoToGame(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)