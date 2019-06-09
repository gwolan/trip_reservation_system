import React, { Component } from 'react';
import {  BrowserRouter, Link, Route } from 'react-router-dom';
import Login from './login';
import Logout from './logout';
import Reports from './reports';
import TimeTable from './timetable';
import CancelTrips from './cancelTrips';
import  {app}  from '../../utilities/base';
import './../../styles/AdminPage.css';
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
          <h1 className="App-header">Pracownicy</h1>
        </div>
        <div>
          <BrowserRouter>
            <ul className="App-NaviBar">
              <Link className="App-NaviBar-Button" to="/logout">Log Out </Link>
              <Link className="App-NaviBar-Button" to="/reports">Reports </Link>
              <Link className="App-NaviBar-Button" to="/canceltrips">Cancel Trips </Link>
			  <Link className="App-NaviBar-Button" to="/timetable">Timetable </Link>
            </ul>
            <Route exact path="/reports" component ={Reports}/>
            <Route exact path="/logout" component ={Logout}/>
            <Route exact path="/canceltrips" component ={CancelTrips}/>
			<Route exact path="/timetable" component ={TimeTable}/>
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
