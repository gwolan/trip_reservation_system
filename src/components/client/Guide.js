import React, {
    Component
} from 'react'
import {
    firestore
} from '../../utilities/base'

class Guide extends Component {
    render() {
        const guide = this.props.contents;
        console.log(guide)
        return (
            <React.Fragment>
                    <div className="Guide">{guide.name} {guide.lastName}</div>
                    <div>{guide.description ? guide.description : "Tymczasowo opis przewodnika jest niedostępny"}</div>
            </React.Fragment>
        );
    }
}

export default Guide