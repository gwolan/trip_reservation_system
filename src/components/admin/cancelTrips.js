import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import  {firestore}  from '../../utilities/base';
import "react-datepicker/dist/react-datepicker.css";
import './../../styles/CancelTrips.css'

class Reports extends Component {
    constructor(props) {
        super(props);
        this.cancelFunction = this.cancelFunction.bind(this);

        this.state = {
            date: "",
            offer: "",
            offers: []
            };
      }

      handleChangeDates = (date) => {
        this.setState({ date: date });
      }

      handleChangeOffer = (event) => {
        this.setState({ offer: firestore.collection("/offers").doc(event.target.value) });
      }

      cancelFunction(e) {
        e.preventDefault();
        const canceltrips = this;
        var offerId = canceltrips.state.offer.id;

        firestore.collection("/offers/"+offerId.toString()+"/trips").get().then(function(col) {

            for (let  [id, data] of Object.entries(col.docs.map(doc => ({id: doc.id, data: doc.data()})))) {
                if(data.data.dates[0].day ===  canceltrips.state.date.day)
                {
                    firestore.collection("/offers/"+offerId.toString()+"/trips").doc(data.id).delete()
                    console.log("Reservation deleted");
                    break;
                }
              }
          }).catch(function(error) {
              console.log(error);
          });
      }

      setOffersList(o) {
        this.setState({
          offers: o,
          offer: firestore.collection("/offers").doc(o[0].id)
        })
      }

      setTripsList(o) {
        this.setState({
          trips: o
        })
      }

      componentWillMount() {
        const canceltrips = this;
  
        firestore.collection("/offers").get().then(function(col) {
            canceltrips.setOffersList(col.docs.map(doc => ({id: doc.id, data: doc.data()})))
          }).catch(function(error) {
              console.log(error);
          });
      }

    render() {
        var ItemId = function(X) {
            return <option>{X.id}</option>;
          };
        return (
            <div className="centered-element">
                <div>
                    <h3>Date</h3>
                </div>
                
                <DatePicker
                    selected={this.state.date}
                    onChange={this.handleChangeDates}
                />
                <div>
                    <div>
                        <h3>Offer:</h3>
                    </div>
                    <div>
                        <select onChange={this.handleChangeOffer}>{this.state.offers.map(ItemId)}</select>
                    </div>
                </div>
                <button className ="CancelButton" onClick={this.cancelFunction}>Cancel Trips</button>
            </div>
        )
    }
}

export default Reports;