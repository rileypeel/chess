import React from 'react'
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import store from '../reducers/index'
import Home from './Home'
import Login from './login/Login'
import User from './user/User'
import Game from './game/Game'
import MenuBar from './utils/MenuBar'
import AcceptModal from './invite/AcceptModal'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'animate.css'
import WebSocketConnection from './utils/WebSocketConnection'
import PrivateRoute from './utils/PrivateRoute'
import './App.css'
import { HOME, LOGIN, USER, GAME } from '../constants/app'

const App = () => (
  <Provider store={store}>
    <Router>
      <ReactNotification/>
      <Switch>
        <Route path={'/gamefornow'}> //TODO TESTING REMOVE LATER
          <Game/>
        </Route>
        <Route path={LOGIN}>
          <Login/>
        </Route>
        <Route path='/'>
          <WebSocketConnection>
            <AcceptModal/>
            <MenuBar/>
            <PrivateRoute path={HOME}>
              <Home/>
            </PrivateRoute>
            <PrivateRoute path={USER}>
              <User/>
            </PrivateRoute>
            <PrivateRoute path={GAME}>
              <Game/>
            </PrivateRoute>
          </WebSocketConnection>
        </Route>
      </Switch>
    </Router>
  </Provider>
)

export default App
