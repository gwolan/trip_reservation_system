import React, { Component } from 'react';
import './../../styles/MainPage.css';
import OfferList from './OfferList';

class mainPage extends Component {

  render() {
    return (
      <div className="App">
        <h1 className="App-header">ZOO Wrocław Zaprasza</h1>
        < OfferList />
      </div>
    );
  }

}
export default mainPage;