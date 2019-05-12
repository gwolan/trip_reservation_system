import React, {
    Component
} from 'react'

const Guide = (props) => {
    console.log(props)
    return (
        <div className="Guide">
            <div className="GuideTitle">{props.guide.name} {props.guide.lastName}</div>
            <div className="GuideDescription">{props.guide.description ? props.guide.description : "Tymczasowo opis przewodnika jest niedostępny"}</div>
        </div>
    );
}

export default Guide