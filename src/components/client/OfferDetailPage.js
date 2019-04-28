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
    async componentDidMount() {
        const ref = firestore.collection('/offers').doc('offer1') // TODO tutaj trzeba zamienic to potem na id pobierane z params
        const offer = await ref.get()

        console.log(offer.data())
        const guides = []
        await offer.data().trips.forEach(async element => {
            (await element.get()).data().guides.forEach(async element => {
                guides.push((await element.get()).data())
            })
        })
        this.setState({
            offer: offer.data(),
            guides: guides
        })
        console.log(guides)
        /*ref.get().then((doc) => {
            if (doc.exists) {
                this.setState({
                    offer: doc.data()
                })
              doc.data().trips.forEach(element => {
                  element.get().then(doc => {
                      doc.data().guides.forEach(element => {
                          element.get().then(doc => {
                            this.setState({
                                guides: [...this.state.guides, doc.data()]
                              })
                          })
                      })
                  })
              })
            } else {
              console.log("No such document!");
            }
          }); */
    }

    render() {
        return (
            <div class = "container">
                <h1 className="offerHeader">{this.state.offer.name}</h1>
                <img src={this.state.offer.photo} alt="Offer" class="img"/>
                <div class="offerContainer">
                    <h2>Opis wycieczki:</h2>
                    <p>{this.state.offer.description}</p>
                    <p><b>Cena wycieczki:</b> {this.state.offer.price} zł/osobę</p>
                    <h2>Przewodnicy:</h2>
                    <p>{this.state.guides.length}</p>
                    <ul className="Guide">
                        {this.state.guides.forEach( (guide)=> <li key={guide.id} className="Guide">wdwd< Guide contents={guide} /></li>)}
                    </ul>
                    <a href='/harmonogram' className='callendarButton'><h3>Zobacz Harmonogram wyczieczek</h3></a>
                </div>
            </div>
        )
    }
}

export default OfferDetailPage