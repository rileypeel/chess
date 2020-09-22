import React from 'react'
import { connect } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import { setActiveTab } from '../../actions/ui'
import '../App.css'
import Game from './Game'


const GameController = props => {

  const panes = Object.keys(props.games).map(key => {

    return {
      menuItem: `Game Vs. ${'fakeopponent1'}`,
      render: () => <Game id={key}/>
    }
  })

  console.log(panes)


  return panes ?
    <Tab
      menu={{ secondary: true }}
      panes={panes} 
      /> 
    : 
    <div>{ "No active games." }</div>
}

const mapStateToProps = state => {
  console.log(state)
  return {
    games: state.game,
    //activeTab: state.ui.activeTab
  }
}

const mapDispatchToProps = dispatch => {
  return {
    //setTab: value => dispatch(setActiveTab(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameController)