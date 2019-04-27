import React, { Component } from 'react';
import {  BrowserRouter, Link, Route } from 'react-router-dom';
import './../styles/App.css';

import MainPage from './client/mainPage';
import AdminPage from './admin/adminPage';

class App extends Component {
  render() {
  return (
    <div>     
      <div>
         <BrowserRouter>
          <Route exact path="/" component ={MainPage}/>
          <Route exact path="/admin" component ={AdminPage}/>
        </BrowserRouter>
      </div>
    </div>
    );
  }

}
export default App;
