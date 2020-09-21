import React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'
import { setActiveItem } from '../../actions/ui'
import { Link } from 'react-router-dom'
import { HOME, LOGIN, USER, GAME } from '../../constants/app'
import '../App.css'

const MenuBar = (props) => {
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
          to={USER}
          name='user'
          active={props.activeItem === 'user'}
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
            as={Link}
            to={LOGIN}
            name='logout'
            active={props.activeItem === 'logout'}
            onClick={props.itemClick}
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
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)