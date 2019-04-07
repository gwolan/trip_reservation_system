import React, { Component } from 'react';
import {  BrowserRouter, Link, Route } from 'react-router-dom';
import './App.css';

import MainPage from './components/mainPage';
import AdminPage from './components/adminPage';

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
