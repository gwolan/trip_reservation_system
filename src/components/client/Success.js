import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import '../../styles/Success.css';

class Success extends Component {
    render() {
        return (
            <div className="container">
                <h1 className="successHeader">Pomyślnie zarezerwowano wycieczkę!</h1>
                <div className="successContainer">
                    <Link to={'/'}>
                        <Button className="buttonSuccess" variant="primary" size="lg" active>POWRÓT DO STRONY GŁÓWNEJ</Button>
                    </Link>
                </div>
            </div>
        )
      }
}

export default Success