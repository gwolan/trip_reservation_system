import React, { Component } from 'react';
import './../styles/Offer.css'

class Offer extends Component {
    render() {
        const offer = this.props.contents;
        return (
            <React.Fragment>
                    <div className="OfferName">{offer.name}</div>
                    <div>{offer.active ? offer.description : "Oferta tymczasowo niedostępna"}</div>
            </React.Fragment>
        );
    }
}

export default Offer;