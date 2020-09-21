import React from 'react'
import { connect } from 'react-redux'
import { Search, Icon } from 'semantic-ui-react'
import { search, setSelectedUser } from '../../actions/user' 
import { setInviteModalOpen } from '../../actions/ui'
import InviteModal from './InviteModal'
import UserLabel from '../user/UserLabel'
import '../App.css'

const GameInvite = props => {

  var formattedResults = []
  if (props.results) {
    for (var i = 0; i < props.results.length; i++) {
      formattedResults.push({title: props.results[i].name, online: props.results[i].online})
    }
  }
  const resultSelected = (e, data) => {
    props.setSelectedUser(data.result)
    props.setOpen(true)
  }
  const searchChange = (e, data) => {
    props.search(data.value)

  }
  const renderer = ({ name, online }) => {
    const color = online ? "green" : "grey"
    return (  
      <div style={{display: "inline-block"}}>
        <Icon size="small" color={color} name="circle" />
        <UserLabel style={{width: "auto"}} name={name} rating={1200} />
      </div>
    )
  }
  return (
    <div className="view">
      <h1>Invite to game</h1>
      <InviteModal/>
      <Search
        results={props.results}
        resultRenderer={renderer}
        onSearchChange={(e, data) => searchChange(e, data)}
        value={props.value}
        onResultSelect={(e, data) => resultSelected(e, data)}
      >
      </Search>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    value: state.user.search.value,
    results: state.user.search.results,
    loading: state.user.search.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    search: searchStr => dispatch(search(searchStr)),
    setOpen: value => dispatch(setInviteModalOpen(value)),
    setSelectedUser: value => dispatch(setSelectedUser(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameInvite)