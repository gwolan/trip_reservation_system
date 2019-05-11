import React, { Component } from 'react';
import {  BrowserRouter, Link, Route } from 'react-router-dom';
import './../styles/App.css';

import MainPage from './client/mainPage'
import AdminPage from './admin/adminPage'
import OfferDetailPage from './client/OfferDetailPage'
import Timetable from './client/Timetable';

class App extends Component {
  render() {
  return (
    <div>     
      <div>
         <BrowserRouter>
          <Route exact path="/" component ={MainPage}/>
          <Route exact path="/admin" component ={AdminPage}/>
          <Route exact path="/offerDetail/:id" component = {OfferDetailPage}/>
          <Route exact path="/timetable/:id" component = {Timetable}/>
        </BrowserRouter>
      </div>
    </div>
    );
  }

}
export default App;
