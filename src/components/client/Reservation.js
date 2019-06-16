import React, {
    Component
} from 'react'
import {
    firestore
} from '../../utilities/base'
import queryString from 'query-string'
import moment from 'moment'
import '../../styles/Reservation.css'
const uuidv1 = require('uuid/v1')
const emailValidationRegex = /^(?:(?:(?:(?:[a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(?:\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|(?:(?:\x22)(?:(?:(?:(?:\x20|\x09)*(?:\x0d\x0a))?(?:\x20|\x09)+)?(?:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(?:\(?:[\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(?:(?:(?:\x20|\x09)*(?:\x0d\x0a))?(\x20|\x09)+)?(?:\x22)))@(?:(?:(?:[a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(?:(?:[a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])(?:[a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*(?:[a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(?:(?:[a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(?:(?:[a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])(?:[a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*(?:[a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i

class Reservation extends Component {

    constructor(props) {
        super(props)
        this.state = {
            offerId: '',
            tripId: '',
            guideId: '',
            tripDate: 0,

            name: '',
            guide: {},
            participants: 0,
            date: '',

            userName: '',
            userLastName: '',
            userEmail: '',
            userParticipants: 0
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const testParticipants = 30-this.state.participants
        if(!this.state.userName || !this.state.userLastName || !emailValidationRegex.test(this.state.userEmail) || this.state.userParticipants > testParticipants) {
            alert('Błędnie uzupełnione pola!')
            return
        }

        firestore.collection(`/offers/${this.state.offerId}/trips/${this.state.tripId}/reservations`).doc(uuidv1()).set({
            name: this.state.userName,
            lastName: this.state.userLastName,
            email: this.state.userEmail,
            guide: this.state.guideId,
            participants: this.state.userParticipants !== 0 ? this.state.userParticipants : 1,
            createdAt: new Date(),
            date: new Date(parseInt(this.state.tripDate))
        }).then(response => {
            this.props.history.push("success");
        }).catch( err => {
            alert('Wystąpił problem spróbuj ponownie za chwile')
        })
    }

    handleChange(event) {
        switch(event.target.name) {
            case 'name':
                this.setState({
                    userName: event.target.value
                })
                break
            case 'lastName':
                this.setState({
                    userLastName: event.target.value
                })
                break
            case 'email':
                this.setState({
                    userEmail: event.target.value
                })
                break
            case 'participants':
                this.setState({
                    userParticipants: parseInt(event.target.value)
                })
                break
            default:
                console.log("Wrong input name")
        }
        console.log(event.target)
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        const offers = firestore.collection('/offers').doc(values.offerId).get()
        this.setState({
            tripDate: values.date,
            guideId: values.guideId,
            offerId: values.offerId,
            tripId: values.tripId,
            date: moment.unix(values.date / 1000).local().format('MMMM Do YYYY, h:mm:ss a'),
            participants: values.participants
        })
        offers.then(response => {
            const offer = response.data()
            this.setState({ name: offer.name })
        })

        const guide = firestore.collection(`/offers/${values.offerId}/trips/${values.tripId}/guides`).doc(values.guideId).get()
        guide.then(response => {
            const guide = response.data()
            this.setState({
                guide: guide
            })
        })
      }

      render() {
        return (
            <div className="container">
                <h1 className="reservationHeader">{this.state.name}</h1>
                <div className="reservationContainer">
                    <h2 className="guide">{`Prowadzi: ${this.state.guide.name} ${this.state.guide.lastName}`}</h2>
                    <p>{`Data: ${this.state.date}`}</p>
                    <p>{`Wolnych miejsc: ${30-this.state.participants}`}</p>
                    <div className="formContainer">
                        <form className="form" onSubmit={this.handleSubmit}>
                            <label className="label">
                                Imię: 
                                <input type="text" name="name" onChange={this.handleChange} />
                            </label>
                            <label className="label">
                                Nazwisko: 
                                <input type="text" name="lastName" onChange={this.handleChange} />
                            </label>
                            <label className="label">
                                E-mail: 
                                <input type="text" name="email" onChange={this.handleChange} />
                            </label>
                            <label className="label">
                                Ilość osób: 
                                <input type="number" min="1" max={`${30-this.state.participants}`} name="participants" placeholder="1" onChange={this.handleChange}/>
                            </label>
                            <input className="subbmitButton" type="submit" value="Rezerwuj" />
                        </form>
                    </div>
                </div>
            </div>
        )
      }
}

export default Reservation