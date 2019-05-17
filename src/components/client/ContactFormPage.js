import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from '@blueprintjs/core'
import { firestore } from '../../utilities/base'
import firebase from 'firebase';
import validateEmail from '../../utilities/validateEmail'
import './../../styles/ContactForm.css';

const FetchwaitTime = 2000

class ContactFormPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
        email: "",
        name: "",
        lastName: "",
        reservationList: [],
        waitingForFetch: false,
        selectedReservation: null,
        submitted: false,
    }

    this.reservationsFetchTimeout = null
  }

  unwrapReservations(reservations) {
    return Promise.all(reservations.map((reservation) => {
        return new Promise((resolve, reject) => {
          // reservation -> parent       -> parent -> parent -> parent
          // reservation -> reservations -> trip   -> trips  -> offer
          reservation.ref.parent.parent.parent.parent.get().then( (offerDoc) => {
            var unwrappedReservation = reservation
            unwrappedReservation.data.offerName = offerDoc.get("name")
            resolve(unwrappedReservation)
          }).catch(err => {
            console.error(err)
            reject(err)
          })
        })
      }));
  }

  pushReservations(reservations) {
    return new Promise((resolve) => {
      this.unwrapReservations(reservations).then(unwrappedReservations => {
        var allReservations = this.state.reservationList
        allReservations = allReservations.concat(unwrappedReservations)
        this.setState({
          email: this.state.email,
          name: this.state.name,
          lastName: this.state.lastName,
          reservationList: allReservations,
          waitingForFetch: this.state.waitingForFetch,
          selectedReservation: this.state.selectedReservation,
          submitted: this.state.submitted,
        })
        console.log("updated Reservation List:")
        console.log(this.state.reservationList);
        resolve()
      })
    })
  }

  fetchReservations() {
    return new Promise((resolve, reject) => {
      firestore.collection("offers").get().then( (offersCollection) => {
        offersCollection.docs.forEach( (offerDoc) => {
          offerDoc.ref.collection("trips").get().then( (tripsCollection) => {
              tripsCollection.docs.forEach( (tripDoc) => {
                tripDoc.ref.collection("reservations").where(
                  "email", "==", this.state.email
                ).where(
                  "name", "==", this.state.name
                ).where(
                  "lastName", "==", this.state.lastName
                ).get().then( (resCollection) => {
                  if (resCollection.docs.length !== 0) {
                    this.pushReservations(resCollection.docs.map(resDoc => ({
                      id: resDoc.id,
                      data: resDoc.data(),
                      ref: resDoc.ref
                    }))).then(() => {
                      resolve()
                    })
                  }
                  resolve()
                }).catch( (error) => {
                  console.log(error)
                  reject(error)
                })
              })
          })
        })
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
      reservationList: this.state.reservationList,
      waitingForFetch: true,
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
            reservationList: this.state.reservationList,
            waitingForFetch: false,
            selectedReservation: this.state.selectedReservation,
            submitted: this.state.submitted,
          })
        })
      }, FetchwaitTime)
  }

  setSelected(event) {
    if(event.target.tagName === 'LI') {
      this.setState({
        email: this.state.email,
        name: this.state.name,
        lastName: this.state.lastName,
        reservationList: this.state.reservationList,
        waitingForFetch: this.state.waitingForFetch,
        selectedReservation: event.target.getAttribute('select-key'),
        submitted: this.state.submitted,
      })
    }
  }

  renderReservationList() {
    if (this.state.waitingForFetch) {
      return (
        <div>
          <label className="ContactForm-label">
            Lista rezerwacji
          </label>
          <Spinner intent="warning"/>
        </div>
      )
    }
    else if (this.state.reservationList.length === 0) {
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
            {this.state.reservationList.map( (reservation, index)=>
              <li key={index} select-key={index} className={index===this.state.selectedReservation ? "SelectedReservation" : "Reservation"}>
                {
                  reservation.data.offerName + ", " +
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
        createdAt: firebase.firestore.Timestamp.now(),
        email: this.state.email,
        resolved: false,
        reservation: this.state.reservationList[this.state.selectedReservation].ref,
        type: this.message.value
      }).then(() => {
        console.log("dodano zgłoszenie")
        this.setState({
          email: this.state.email,
          name: this.state.name,
          lastName: this.state.lastName,
          reservationList: this.state.reservationList,
          waitingForFetch: this.state.waitingForFetch,
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
