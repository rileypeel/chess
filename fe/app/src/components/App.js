import React from 'react'
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import store from '../reducers/index'
import Home from './home/Home'
import Login from './login/Login'
import GameController from './game/GameController'
import Game from './game/Game'
import MenuBar from './utils/MenuBar'
import AcceptModal from './invite/AcceptModal'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'animate.css'
import WebSocketConnection from './utils/WebSocketConnection'
import PrivateRoute from './utils/PrivateRoute'
import './App.css'
import { HOME, LOGIN, GAME } from '../constants/app'

const App = () => (
  <Provider store={store}>
    <Router>
      <ReactNotification/>
      <Switch>
        <Route path={LOGIN}>
          <Login/>
        </Route>
        <Route exact path='/'>
        <Route
          render={({ location }) => (
            <Redirect
              to={{
                pathname: HOME,
                state: { from: location }
              }}
            />
          )}
        />
        </Route>
        <Route path='/'>
          <WebSocketConnection>
            <AcceptModal/>
            <MenuBar/>
            <PrivateRoute path={HOME}>
              <Home/>
            </PrivateRoute>
            <PrivateRoute path={GAME}>
              <GameController/>
            </PrivateRoute>
          </WebSocketConnection>
        </Route>
      </Switch>
    </Router>
  </Provider>
)

export default App
