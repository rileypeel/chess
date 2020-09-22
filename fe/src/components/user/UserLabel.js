import React from 'react'
import { Label } from 'semantic-ui-react'
import defaultImg from '../../default.jpg'
import '../App.css'

const UserLabel = props => (
  <Label size={props.size} style={{height: "auto"}} classNameas='a' color='grey' image>
    <img style={{display: "inline-block"}} src={defaultImg} />
    { props.name }
    <Label.Detail>{ props.rating }</Label.Detail>
  </Label>
)


export default UserLabel