import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import  {firestore}  from '../../utilities/base';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import './../../styles/CancelTrips.css'

const styles = {
  width: "90%",
  maxWidth: "315px",
  margin: "20px auto",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px",
  background: "#883333"
}

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
        this.setState({ offer: firestore.collection("/offers").doc(event.target.value.substring(0, event.target.value.indexOf(" "))) });
      }

      async cancelFunction(e) {
        e.preventDefault();
        const canceltrips = this;
        var offerId = canceltrips.state.offer.id;

        firestore.collection("/offers/"+offerId.toString()+"/trips").get().then(function(col) {

            for (let  [id, data] of Object.entries(col.docs.map(doc => ({id: doc.id, data: doc.data()})))) {

                if(data.data.dates[0].toDate().toDateString() ===  canceltrips.state.date.toDateString())
                {
                    //usuwanie przewodników
                  firestore.collection("/offers/"+offerId.toString()+"/trips/"+data.id.toString()+"/guides").get().then(function(col2) {
                    for (let  [id2, data2] of Object.entries(col2.docs.map(doc2 => ({id2: doc2.id, data2: doc2.data()})))) {
                      firestore.collection("/offers/"+offerId.toString()+"/trips/"+data.id.toString()+"/guides").doc(data2.id2).delete()
                    }}).catch(function(error) {
                      console.log(error);
                    });

                    //usuwanie rezerwacji
                    firestore.collection("/offers/"+offerId.toString()+"/trips/"+data.id.toString()+"/reservations").get().then( function(col2) {
                      for (let  [id2, data2] of Object.entries(col2.docs.map(doc2 => ({id2: doc2.id, data2: doc2.data()})))) {
                          //wysyłanie maila
                        firestore.collection("/offers/"+offerId.toString()+"/trips/"+data.id.toString()+"/reservations").doc(data2.id2).delete().then(async () => {
                          const form = await axios.post('/api/form', {
                            text: `Z przyczyn technicznych Twoja rezerwacja na dzień ${data2.data2.date.toDate().toDateString()} na osobę ${data2.data2.name} ${data2.data2.lastName} została usunięta. Wycieczki z wybranej oferty nie będą możliwe danego dnia. Przepraszamy i zapraszamy na wycieczkę w innym dniu`,
                            id: data2.data2.email     
                            })
                        })
                      }}).catch(function(error) {
                        console.log(error);
                      });

                    //usuwanie trip
                    firestore.collection("/offers/"+offerId.toString()+"/trips").doc(data.id).delete()
                    alert("Wycieczki z dnia " + canceltrips.state.date.toDateString()+ " zostaly usuniete")
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
            return <option>{X.id} {X.data.name}</option>;
          };
        return (
            <div style={styles}>
                <div >
                    <h3 className="label">Date</h3>
                </div>
                
                <DatePicker
                    selected={this.state.date}
                    onChange={this.handleChangeDates} 
                />
                <div>
                    <div>
                        <h3 className="label">Offer</h3>
                    </div>
                    <div>
                        <select className="elem" onChange={this.handleChangeOffer}>{this.state.offers.map(ItemId)}</select>
                    </div>
                </div>
                <hr style={{marginTop: "10px", marginBottom: "10px"}}/>
                <button className="elem" onClick={this.cancelFunction}>Cancel Trips</button>
            </div>
        )
    }
}

export default Reports;
