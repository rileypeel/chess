import React from 'react'
import { connect } from 'react-redux'
import GameInvite from '../invite/GameInvite'
import UserLabel from '../user/UserLabel'
import HomeStatsBox from './HomeStatsBox'
import '../App.css' 

const Home = props => {
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
    rating: state.user.rating
  }
}


export default connect(mapStateToProps, null)(Home)