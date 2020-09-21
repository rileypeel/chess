import React from 'react'
import { connect } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import '../App.css'

const panes = [
  {
    menuItem: 'Tab 1',
    render: () => <Tab.Pane attached={false}>Tab 1 Content</Tab.Pane>,
  },
  {
    menuItem: 'Tab 2',
    render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
  },
  {
    menuItem: 'Tab 3',
    render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>,
  },
]
  
const GameController = props => {

  const panes = Object.keys(props.games).forEach(key => {

    return {
      menuItem: `Game Vs. ${'fakeopponent1'}`,
      render: () => <Game id={key}/>
    }
  })
  


  return panes ? <Tab menu={{ secondary: true }} panes={panes} /> : <div>{ "No active games." }</div>
}

const mapStateToProps = (state) => {
  return {
    games: state.game
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameController)