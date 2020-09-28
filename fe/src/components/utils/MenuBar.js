import React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'
import { setActiveItem } from '../../actions/ui'
import { logoutUser } from '../../actions/user'
import { Link } from 'react-router-dom'
import { HOME, GAME } from '../../constants/app'
import '../App.css'

const MenuBar = (props) => {
  const logoutClicked = () => {
    
    props.logout()
  }
  return (
    <div className="menu">
      <Menu pointing secondary>
        <Menu.Item
          as={Link}
          to={HOME}
          name='home'
          active={props.activeItem === 'home'}
          onClick={props.itemClick}
        />
        <Menu.Item
          as={Link}
          to={GAME}
          name='game'
          active={props.activeItem === 'game'}
          onClick={props.itemClick}
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='logout'
            active={props.activeItem === 'logout'}
            onClick={logoutClicked}
          />
        </Menu.Menu>
      </Menu>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    activeItem: state.ui.activeItem
  }
} 

const mapDispatchToProps = (dispatch) => {
  return {
    itemClick: (event, menuItem) => { 
      return dispatch(setActiveItem(menuItem.name))
    },
    logout: () => dispatch(logoutUser())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)