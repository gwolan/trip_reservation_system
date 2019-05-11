import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Spinner } from '@blueprintjs/core'
import { firestore } from '../../utilities/base'
import firebase from 'firebase';
import validateEmail from '../../utilities/validateEmail'
import './../../styles/ContactForm.css';

const UIwaitTime = 2000

class ContactFormPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
        email: "",
        name: "",
        lastName: "",
        list: [],
        waitingForUI: false,
        selectedReservation: null,
        submitted: false,
    }

    this.reservationsFetchTimeout = null
  }

  unwrapTrips(trips) {
    var unwrappedTrips = trips
    return new Promise((resolve, reject) => {
      trips.data.offer.get().then(doc => {
        unwrappedTrips.data.offer = {
          id: doc.id,
          data: doc.data()
        }
        resolve(unwrappedTrips)
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
  }
  /*
  unwrapReservations(reservations) {
    const contactFormPage = this
    var unwrappedReservations = reservations
    reservations.forEach((element, index) => {
      element.data.trips.get().then(doc => {
          unwrappedReservations[index].data.trip = contactFormPage.unwrapTrips({id: doc.id, data: doc.data()})
      }).catch(err => console.error(err))
    });
    return unwrappedReservations
  }
  */
  unwrapReservations(reservations) {
    const contactFormPage = this
    return Promise.all(reservations.map((element, index) => {
        return new Promise((resolve, reject) => {
          element.data.trips.get().then(doc => {
            contactFormPage.unwrapTrips({id: doc.id, data: doc.data()}).then((unwrappedTrips) => {
              var unwrappedReservation = element
              unwrappedReservation.data.trips = unwrappedTrips
              resolve(unwrappedReservation)
            })
          }).catch(err => {
            console.error(err)
            reject(err)
          })
        })
      }));
  }
  
  setReservations(reservations) {
    return new Promise((resolve) => {
      this.unwrapReservations(reservations).then(unwrappedReservations => {
        this.setState({
          email: this.state.email,
          name: this.state.name,
          lastName: this.state.lastName,
          list: unwrappedReservations,
          waitingForUI: this.state.waitingForUI,
          selectedReservation: this.state.selectedReservation,
          submitted: this.state.submitted,
        })
        console.log("updated Reservation List:")
        console.log(this.state.list);
        resolve()
      })
    })
  }
  
  fetchReservations() {
    const ContactFormPage = this
    return new Promise((resolve, reject) => {
      firestore.collection("/reservations").where(
        "email", "==", ContactFormPage.state.email
      ).where(
        "name", "==", ContactFormPage.state.name
      ).where(
        "lastName", "==", ContactFormPage.state.lastName
      ).get().then(function(qr) {
          ContactFormPage.setReservations(qr.docs.map(doc => ({id: doc.id, data: doc.data()}))).then(() => {
            resolve()
          })
      }).catch(function(error) {
          console.log(error)
          reject(error)
      })
    })
  }

  initializeReservationsFetch(event) {
    var email = this.state.email
    var name = this.state.name
    var lastName = this.state.lastName
    switch(event.target.name) {
      case "email": email = event.target.value; break
      case "name": name = event.target.value; break
      case "lastName": lastName = event.target.value; break
      default: return
    }
    this.setState({
      email: email,
      name: name,
      lastName: lastName,
      list: this.state.list,
      waitingForUI: true,
      selectedReservation: null,
      submitted: this.state.submitted,
    })
    clearTimeout(this.reservationsFetchTimeout)
    this.reservationsFetchTimeout = setTimeout(
      () => {
        this.fetchReservations().then(() => {
          this.setState({
            email: this.state.email,
            name: this.state.name,
            lastName: this.state.lastName,
            list: this.state.list,
            waitingForUI: false,
            selectedReservation: this.state.selectedReservation,
            submitted: this.state.submitted,
          })
        })
      }, UIwaitTime)
  }

  setSelected(event) {
    if(event.target.tagName === 'LI') {
      this.setState({
        email: this.state.email,
        name: this.state.name,
        lastName: this.state.lastName,
        list: this.state.list,
        waitingForUI: this.state.waitingForUI,
        selectedReservation: event.target.getAttribute('select-key'),
        submitted: this.state.submitted,
      })
    }
  }

  renderReservationList() {
    if (this.state.waitingForUI) {
      return (
        <div>
          <label className="ContactForm-label">
            Lista rezerwacji
          </label>
          <Spinner intent="warning"/>
        </div>
      )
    }
    else if (this.state.list.length === 0) {
      return (
        <div>
          <label className="ContactForm-label">
            Lista rezerwacji
          </label>
          <div>
            brak rezerwacji dla podanych danych.
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <label className="ContactForm-label">
            Lista rezerwacji
          </label>
          <ul className="ReservationList" onClick={(event) => {this.setSelected(event)}}>
            {this.state.list.map( (reservation, index)=>
              <li key={index} select-key={index} className={index==this.state.selectedReservation ? "SelectedReservation" : "Reservation"}>
                {
                  reservation.data.trips.data.offer.data.name + ", " +
                  reservation.data.date.toDate().toLocaleString() + ", " +
                  "liczba zarezerwowanych uczestników: " + reservation.data.participants
                }
              </li>
            )}
          </ul>
        </div>
      )
    }
  }

  submitForm() {
    if (this.state.email.length === 0)
      alert("Proszę podać email")
    else if (!validateEmail(this.state.email))
      alert("Podano niepoprawny email")
    else if (this.state.name.length === 0)
      alert("Proszę podać imię")
    else if (this.state.lastName.length === 0)
      alert("Proszę podać nazwisko")
    else if (this.state.selectedReservation === null)
      alert("Proszę wybrać rezerwację")
    else if (this.message.value.length === 0)
      alert("Proszę podać powód zgłoszenia")
    else
      firestore.collection("/reports").add({
        createdat: firebase.firestore.Timestamp.now(),
        email: this.state.email,
        resolved: false,
        trip: firestore.doc("/trips/" + this.state.list[this.state.selectedReservation].data.trips.id),
        type: this.message.value
      }).then(() => {
        console.log("dodano zgłoszenie")
        this.setState({
          email: this.state.email,
          name: this.state.name,
          lastName: this.state.lastName,
          list: this.state.list,
          waitingForUI: this.state.waitingForUI,
          selectedReservation: this.state.selectedReservation,
          submitted: true,
        })
      }).catch(function(error) {
        console.error("Wystąpił błąd podczas dodawania dokumentu: ", error);
    });
    
  }

  render() {
    if (this.state.submitted === true) {
      return (
        <div>
          <h1 className="ContactFormPage-header" style={{marginTop: "200px", textAlign: "center"}}>
            Formularz zgłoszony prawidłowo<br/>
            Dziękujemy za zgłoszenie formularza
          </h1>
          <div style={{width: "auto", padding: "10px 80px 100px"}}>
            <button className="ReturnButton">
              <Link className="ReturnLink" to="/">Powrót do strony głównej</Link>
            </button>
          </div>
        </div>
      )
    }
    return (
      <div>
        <h1 className="ContactFormPage-header">
          Formularz Kontaktowy
        </h1>
        <div className="ContactForm">
          <form onChange={(event) => { this.initializeReservationsFetch(event) }} onSubmit={()=> {this.submitForm()}}>
            <div style={{width: "auto", padding: "10px 20px"}}>
              <label className="ContactForm-label">
                Email
              </label>
              <input style={{height: "30px", width: "100%"}} name="email" type="email" placeholder="Email" required="required"></input>
            </div>
            <div style={{float: "left", width: "50%", padding: "10px 20px"}}>
              <label className="ContactForm-label">
                Imię
              </label>
              <input style={{height: "30px", width: "100%"}} name="name" placeholder="Imię" required="required"></input>
            </div>
            <div style={{float: "right", width: "50%", padding: "10px 20px"}}>
              <label className="ContactForm-label">
                Nazwisko
              </label>
              <input style={{height: "30px", width: "100%"}} name="lastName" placeholder="Nazwisko" required="required"></input>
            </div>
            <div style={{width: "auto", padding: "10px 20px"}}>
              {this.renderReservationList()}
            </div>
            <div style={{width: "auto", padding: "10px 20px"}}>
              <label className="ContactForm-label">
                Treść wiadomości
              </label>
              <textarea style={{width: "100%"}} rows="10" name="message" ref={(textarea) => {this.message = textarea}} placeholder="Treść wiadomości" required="required"></textarea>
            </div>
            <div style={{width: "auto", padding: "10px 25px 100px"}}>
              <input className="ContactForm-submit" type="button" onClick={(event) => {this.submitForm(event)}} value="Wyślij"></input>
            </div>
          </form>
        </div>
        <div className="App-Footer">
          <Link className="App-Footer-Button" to="/">Powrót do strony głównej</Link>
        </div>
      </div>
    );
  }

}

export default ContactFormPage;