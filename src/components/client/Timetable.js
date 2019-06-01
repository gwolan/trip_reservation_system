import React, {
    Component
} from 'react';
import {
    Link
} from 'react-router-dom';
import {
    firestore
} from '../../utilities/base';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './../../styles/Timetable.css'
import moment from 'moment'
import Button from 'react-bootstrap/Button'

class Timetable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            offer: {},
            startDate: new Date(),
            reservations: new Map()
        };
        this.trips = []
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const offers = firestore.collection('/offers').doc(this.props.match.params.id).get()
        offers.then(response => {
                const offer = response.data()
                this.setState({ offer: offer })
        })
        const trips = firestore.collection(`/offers/${this.props.match.params.id}/trips`).get()
        trips.then(response => {
            console.log(response)
            let tr
            this.trips = response.docs.map(doc => {
                console.log(doc.data())
                tr = doc.data()
                tr.id = doc.id
                return tr
            })
        })
    }

    handleChange(date) {
        // tutaj znajduje czy jest taki trip z ofeety dla danego dnia miesiaca
        const currentDate = date
        this.setState({
            startDate: currentDate,
            reservations: new Map()
        })
        if(this.trips.length !== 0) {
            let tmpDate = Date()
            let startDate = date
            startDate.setHours(0,0,0,0)
            const trip = this.trips.find(trip => {
                return trip.dates.find(date => {
                    tmpDate = date.toDate()
                    console.log(tmpDate)
                    tmpDate.setHours(0,0,0,0)
                    return tmpDate.getTime() === startDate.getTime()
                }) !== undefined
            })
            // jak jest to wtedy przetworz go
            if(trip !== undefined) {
                const map = new Map()
                // zapisz daty do tabeli
                trip.dates.forEach(date => {
                    map.set(date.toDate().getTime(), [])
                })
                this.setState({
                    startDate: currentDate,
                    reservations: map
                })
                // pobierz wszystkie rezerwacje
                const reservations = firestore.collection(`/offers/${this.props.match.params.id}/trips/${trip.id}/reservations`).get()
                const guides = firestore.collection(`/offers/${this.props.match.params.id}/trips/${trip.id}/guides`).get()
                let rr = []
                let gg = []
                reservations.then(response => { // TODO na razie jest jeden
                    console.log(response.docs[0].data())
                    rr = response.docs.map(doc => doc.data())
                    guides.then(response => {
                        console.log(response.docs[0].data())
                        gg = response.docs.map(doc => {
                            return {
                                id: doc.id,
                                guide: doc.data()
                            }
                        })
                        // mam przedownikow i rezerwacje teraz trzeba to wszystko polaczyc w jedna dana
                        trip.dates.forEach(date => {
                            map.set(date.toDate().getTime(), gg.map(g=> {
                                return {guide: g, participants: 0}
                            }))
                            this.setState({
                                startDate: currentDate,
                                reservations: map
                            })
                        })
                        let mapVal
                        let cell
                        rr.forEach(r => {
                            if(map.has(r.date.toDate().getTime())) {
                                mapVal = map.get(r.date.toDate().getTime())
                                cell = mapVal.find(e => {
                                    return e.guide.id === r.guide
                                })
                                if(cell !== undefined) {
                                    cell.participants += r.participants
                                }
                                this.setState({
                                    startDate: currentDate,
                                    reservations: map
                                })
                            }
                        })
                    })
                })
            }
        }
    }

    renderHeaderCol(id, guide) {
        return (
            <th key={id}>{`${guide.name} ${guide.lastName}`}</th>
        )
    }

    renderHeader() {
        const key = this.state.reservations.keys().next().value
        return (
            <tr>
                <th> </th>
                <th>Godzina</th>
                {this.state.reservations.get(key).map(e => {
                    console.log(e.guide.guide)
                    return this.renderHeaderCol(e.id, e.guide.guide)
                })}
            </tr>
        )
    }

    renderRows() {
        const keys =Array.from( this.state.reservations.keys())
        console.log(keys)
        let index = 1
        return keys.map(key => {
            return (
                <tr>
                    <th>{index++}</th>
                    <th>{moment(key).local().format('HH:mm')}</th>
                    {this.state.reservations.get(key).map(val => {
                        return (
                            <th>{val.participants}/30 <Button className="button" variant="primary" size="lg" active>REZERWUJ</Button></th>
                        )
                    })}
                </tr>
            )
        })
    }

    renderTable() {
        if(this.state.reservations.keys().next().value !== undefined) {
            return (
                <table id='timetable'>
                    <tbody>
                        {this.renderHeader()}
                        {this.renderRows()}
                    </tbody>
                </table>
            )
        } else {
            return (<div><h2>Niestety nie ma obecnie wycieczek dla podanej daty</h2></div>)
        }
    }

    render() {
        return (
            <div className="container">
                <div className="buttonContainer">
                    <a href={"/offerDetail/" + this.props.match.params.id}><img src="https://image.flaticon.com/icons/png/512/53/53567.png" alt="backButton" /></a>
                </div>
                <h1 className="timetableHeader">Harmonogram</h1>
                <div className="timetableContainer">
                    <DatePicker className="datePicker"
                        selected={this.state.startDate}
                        onChange={this.handleChange}
                    />
                    <div>
                       {this.renderTable()}
                    </div>
                </div>
            </div>
        )
    }
}


export default Timetable