import React, {
    Component
} from 'react'
import {
    firestore
} from '../../utilities/base'
import './../../styles/OfferDetail.css'
import './../../styles/Guide.css'
import Guide from './Guide';

class OfferDetailPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            offer: {},
            guides: []
        }
    }
    componentDidMount() {
        const gg = []
        const offers = firestore.collection('/offers').doc(this.props.match.params.id).get()

        offers.then((response) => {
            const offer = response.data()
            this.setState({ offer: offer })
            const trips = offer.trips
            console.log(trips)
            trips.forEach(element => {
                element.get().then(data => {
                    let guides = data.data().guides
                    guides.forEach(element => {
                        element.get().then(guide => {
                            gg.push(guide.data())
                            this.setState({
                                guides: gg
                            })
                        })
                    })
                })
            })
        }
        )
    }

    render() {
        this.state.guides.forEach((guide) => console.log(guide))
        return (
            <div className="container">
                <h1 className="offerHeader">{this.state.offer.name}</h1>
                <img src={this.state.offer.photo} alt="Offer" className="img" />
                <div className="offerContainer">
                    <h2 className="offerTitle">Opis wycieczki:</h2>
                    <p className="offerDescription">{this.state.offer.description}</p>
                    <p className="offerPrice"><b>Cena wycieczki:</b> {this.state.offer.price} zł/osobę</p>
                    <a href='/harmonogram' className='callendarButton'>Zobacz Harmonogram wycieczek</a>
                    <div className="guideTitle">Przewodnicy: </div>
                    <div className="guideContainer">
                        {this.state.guides.map((guide) => <Guide guide={guide} />)}
                    </div>
                </div>
            </div>
        )
    }
}

export default OfferDetailPage