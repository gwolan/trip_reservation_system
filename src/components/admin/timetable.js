import React, { Component } from 'react';
import  {firestore}  from '../../utilities/base';
import firebase from 'firebase';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";
import './../../styles/TimeTableAdmin.css';

const timeTableStyles = {
  width: "90%",
  maxWidth: "315px",
  margin: "20px auto",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px",
  background: "#883333"
}

class timetable extends Component {

    constructor(props) {
      super(props);
      this.addTrip = this.addTrip.bind(this);
      this.handleChangeDates = this.handleChangeDates.bind(this);
      this.handleChangeActive = this.handleChangeActive.bind(this);
      this.handleChangeGuide = this.handleChangeGuide.bind(this);
	  this.handleTripChange = this.handleTripChange.bind(this);
	  this.clearFunction = this.clearFunction.bind(this);
	  this.clearFunction2 = this.clearFunction2.bind(this);
      this.state = {
          date: "",
          guide: "",
          offer: "",
		  cnt : 0,
		  guideName: "",
		  tripId: "trip",
		  dates: [],
          reservation: {},
          guides: [],
		  addGuides: [],
          offers: []
        };
    }
	
	clearFunction(e) {
        e.preventDefault();
        this.setState({
            dates: []
          })
      }
	  
	clearFunction2(e) {
        e.preventDefault();
        this.setState({
            addGuides: []
          })
      }
    handleChangeDates = (date) => {
      this.setState({ date: date,
					  dates: this.state.dates.concat(date)
					});
    }

    handleChangeActive = (event) => {
      this.setState({ active: event.target.value });
    }

    handleTripChange = (event) => {
      this.setState({ tripId: event.target.value });
    }

    handleChangeGuide = (event) => {
		const e = event.target.value;
		const t = this;  
		this.setState({ guide: firestore.collection("/guides").doc(e),
						addGuides: this.state.addGuides.concat(firestore.collection("/guides").doc(e))
					});
		firestore.collection("/guides").doc(e).get().then(function(doc) {
		t.setState({
			guideName: doc.data().name+" "+doc.data().lastName
		})
	  })
    }
	
    handleChangeOffer = (event) => {
      this.setState({ offer: firestore.collection("/offers").doc(event.target.value) });
    }

   addTrip(e)
    {    
	e.preventDefault();
	var tripId = 'trip11';
	const t = this;

	  firestore.collection(`offers/${this.state.offer.id}/trips`).doc(t.state.tripId).set({
		active: true,
        dates: this.state.dates,
      });


	for( const guide of this.state.addGuides)
	{
		firestore.collection("/guides").doc(guide.id).get().then(function(doc) {
			firestore.collection(`offers/${t.state.offer.id}/trips/${t.state.tripId}/guides`).doc(guide.id).set({
			name: doc.data().name,
			lastName: doc.data().lastName,
			description: doc.data().description,
			uniqueId: doc.data().uniqueId
		  });
		}) 
	}
	alert("Wycieczki zostały dodane");
    };
	
    componentWillMount() {
      const timetable = this;
	  let gg = []
		
		firestore.collection("/offers").get().then(function(col) {
        timetable.setOffersList(col.docs.map(doc => ({id: doc.id, data: doc.data()})))
        }).catch(function(error) {
            console.log(error);
        });
		      
		firestore.collection("/guides").get().then(function(col) {
        timetable.setGuideList(col.docs.map(doc => ({id: doc.id, data: doc.data()})))
        }).catch(function(error) {
            console.log(error);
        });



    }

    setGuideList(g) {
      this.setState({
        guides: g
      })
    }
    setOffersList(o) {
		const timetable = this;
      this.setState({
        offers: o,
        offer: firestore.collection("/offers").doc(o[0].id)
      })
    }

    render(){

      var ItemId = function(X) {
        return <option>{X.id}</option>;
      };
	  
      return (
        <div style={timeTableStyles}>
          <div>
            <h1 className="name">Grafik</h1>
          </div>
          <div>
			<div>
                <label className="label">
					Indeks: 
                    <input style={{width: "100%"}} name="name" onChange={this.handleTripChange} value={this.state.tripId}></input>
                </label>
            </div>
				  <div>
                  <label className="label" for="date">Wybrane daty</label>
                  </div>
				   <ul >{this.state.dates.map( (date)=><li key={date}>{date.toString()}</li>)}
					</ul>
				  <div>
                  <label className="label" for="date">Wybierz datę</label>
                  </div>
                  <div> 
                    <DatePicker
                        selected={this.state.date}
                        onChange={this.handleChangeDates}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        includeTimes={[setHours(setMinutes(new Date(), 0), 9), setHours(setMinutes(new Date(), 0), 10), setHours(setMinutes(new Date(), 0), 11), setHours(setMinutes(new Date(), 0), 13), setHours(setMinutes(new Date(), 0), 14), setHours(setMinutes(new Date(), 0), 15), setHours(setMinutes(new Date(), 0), 16), setHours(setMinutes(new Date(), 0), 17)]}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="time"
                    />
                  </div>  
                  <button className ="Button" onClick={this.clearFunction}>Wyczyść</button>
					<ul >{this.state.addGuides.map( (guide)=><li key={guide}>{guide.id}</li>)}
					</ul>
				  
                  <div>
                    <label className="label" for="guides">Przewodnik:</label>
                  </div>
                  <div>
                    <select style={{width: "100%"}} onChange={this.handleChangeGuide}>{this.state.guides.map(ItemId)}</select>
                  </div>
				  <button className ="Button" onClick={this.clearFunction2}>Wyczyść</button>
				  <div>
					<h3>{this.state.guide.id} - {this.state.guideName}</h3>
                  </div>
				  
                  <div>
                    <label className="label"  for="offers">Oferta:</label>
                  </div>
                  <div>
                    <select style={{width: "100%"}} onChange={this.handleChangeOffer}>{this.state.offers.map(ItemId)}</select>
                  </div>
                  <hr style={{marginTop: "10px", marginBottom: "10px"}}/>
				<div>
                      <button className="button" onClick={this.addTrip}>Dodaj do grafiku</button>
                </div>
          </div>
 </div>
      );
  }
  }
  export default timetable;
  