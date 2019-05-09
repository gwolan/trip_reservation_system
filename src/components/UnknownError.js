import React, { Component } from 'react';
import './../styles/UnkownError.css';

class UnknownErrorPage extends Component {

    render() {
        return (
            <div className="UnkownError">
                <div id="message">
                <h2>404</h2>
                <h1>Page Not Found</h1>
                <p>The specified file was not found on this website. Please check the URL for mistakes and try again.</p>
                </div>
            </div>
        )
    }
}

export default UnknownErrorPage;