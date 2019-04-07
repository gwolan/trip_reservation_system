import React, { Component } from 'react';
import {  BrowserRouter, Link, Route } from 'react-router-dom';
import Login from './login';
import Logout from './logout';
import  {app}  from '../base';
class adminPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
        currentUser: null,
        authenticated: false
      };
  }

  setCurrentUser(user) {
    if (user) {
      this.setState({
        currentUser: user,
        authenticated: true
      })
    } else {
      this.setState({
        currentUser: null,
        authenticated: false
      })
    }
  }

  componentWillMount() {
    this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
        })
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
        })
      }
    })
  }

  componentWillUnmount() {
    this.removeAuthListener();
  }
  render() {
    if(this.state.authenticated === true){
    return (
      <div>
        <div>
          <h1>Strona dla admina </h1>
        </div>
        <div>
          <BrowserRouter>
            <Route exact path="/logout" component ={Logout}/>
            <Link className="button" to="/logout">Log Out</Link>
          </BrowserRouter>
        </div>
      </div>
    );
  }
  else
  {
    return (
        <div>
            <div>
                <BrowserRouter>
                <Route exact path="/admin" component ={Login}/>
                </BrowserRouter>
            </div>
        </div>
      );
  }
}



}
export default adminPage;
