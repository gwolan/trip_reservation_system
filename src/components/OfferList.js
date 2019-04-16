import React, { Component } from 'react';
import firestore from '../utilities/firestore';
import Offer from './Offer';
import './../styles/Offer.css'

class OfferList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: []
        }
    }

    componentWillMount() {
        const offerList = this;
        firestore.collection("/offers").get().then(function(col) {
            offerList.setOfferList(col.docs.map(doc => ({id: doc.id, data: doc.data()})))
        }).catch(function(error) {
            console.log(error);
        });
    }

    setOfferList(offers) {
        this.setState({
            list: offers
        })
        console.log(this.state.list);
    }

    render() {
        return (
                <ul className="OfferList">
                    {this.state.list.map( (offer)=> <li key={offer.id} className="Offer">< Offer contents={offer.data} /></li>)}
                </ul>
        )
    }
}

export default OfferList;