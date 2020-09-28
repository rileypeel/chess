import React from 'react'
import { connect } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import '../App.css'
import Game from './Game'

const GameController = props => {
  const panes = Object.keys(props.games).map(key => {
    const opponentName = props.games[key].game.opponent.user.name
    const gameId = key.substring(0, 3)
    return {
      menuItem: `Game (${gameId}) Vs. ${opponentName}`,
      render: () => <Game id={key}/>
    }
  })
  return panes.length > 0 ?
    <Tab
      menu={{ secondary: true }}
      panes={panes} 
      /> 
    : 
    <div style={{ position: 'absolute', height: '50%', width: '50%' }}>{'No active games.'}</div>
}

const mapStateToProps = state => ({ games: state.game })

export default connect(mapStateToProps, null)(GameController)