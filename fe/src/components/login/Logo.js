import React from 'react'
import knight from '../../knight.jpg'
import '../App.css'

const Logo = () => (
  <div className="logo-container">
    <h1 className="logo-text">Chess</h1>
    <img alt={"Logo"} className="logo-img" src={knight}/>
  </div>
)

export default Logo