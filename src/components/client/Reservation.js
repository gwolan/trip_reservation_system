import React, {
    Component
} from 'react'
import {
    firestore
} from '../../utilities/base'
import queryString from 'query-string'
import moment from 'moment'

class Reservation extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            guide: {},
            participants: 0,
            date: ''
        }
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        const offers = firestore.collection('/offers').doc(values.offerId).get()
        this.setState({
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
                <h1 className="timetableHeader">{this.state.name}</h1>
                <div className>
                    <h2 className="guide">{`Prowadzi: ${this.state.guide.name} ${this.state.guide.lastName}`}</h2>
                    <p>{`Data: ${this.state.date}`}</p>
                    <p>{`Wolnych miejsc: ${30-this.state.participants}`}</p>
                    <form>
                        <label>
                            Imię: 
                            <input type="text" name="name" />
                        </label>
                            <label>
                                Nazwisko: 
                                <input type="text" name="lastName" />
                            </label>
                            <label>
                                E-mail: 
                                <input type="text" name="email" />
                            </label>
                            <label>
                                Ilość osób: 
                                <input type="number" min="1" max={`${30-this.state.participants}`}
                                name="participants" placeholder="1"/>
                            </label>
                        <input type="submit" value="Rezerwuj" />
                    </form>
                </div>
            </div>
        )
      }
}

export default Reservation