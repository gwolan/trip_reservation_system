import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './../../styles/MainPage.css';
import OfferList from './OfferList';

class mainPage extends Component {

  render() {
    return (
      <React.Fragment>
        <div className="App">
          <h1 className="App-header">ZOO Wrocław Zaprasza</h1>
          <OfferList/>
        </div>
        <div className="App-Footer">
          <Link className="App-Footer-Button" to="/contactForm">Formularz Kontaktowy</Link>
        </div>
      </React.Fragment>
    );
  }

}
export default mainPage;