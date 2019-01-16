import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwtDecode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import ProvateRoute from './components/common/PrivateRoute';

import store from './store';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import './App.scss';
import CreateProfile from './components/create-profile/CreateProfile';

if(localStorage.jwtToken) {
   // Set auth token header auth
   setAuthToken(localStorage.jwtToken);
   // Decode token and get user info and exp
  const decoded = jwtDecode(localStorage.jwtToken);
   // Set user and isAuthenticated
   store.dispatch(setCurrentUser(decoded));

    // Check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Logout user
      store.dispatch(logoutUser());
          // Clear current Profile
    store.dispatch(clearCurrentProfile());
      // Redirect to login
      window.location.href = '/login';
    }
} 

class App extends Component {
  render() {
    return (
      <Provider store = {store}>
        <Router>
          <div className="App">
              <Navbar />
                <Route exact path = '/' component = { Landing } />
                <div className="container">
                  <Route exact path = '/login' component = { Login } />
                  <Route exact path = '/register' component = { Register } /> 
                  <Switch>
                    <ProvateRoute exact path = '/dashboard' component = { Dashboard } /> 
                  </Switch>
                  <Route exact path = '/create-profile' component = { CreateProfile } /> 
                </div>
              <Footer />
          </div>
        </Router>             
      </Provider>


    );
  }
}

export default App;
