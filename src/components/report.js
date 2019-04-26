import React, { Component } from 'react';
import  {firestore}  from '../base';

class Report extends Component {

    constructor(props) {
        super(props);
        this.resolveFunction = this.resolveFunction.bind(this);
      }

    resolveFunction(e) {
        const index = this.props.id;
        const raport = this.props.contents;
        e.preventDefault();

        firestore.collection("/reservations").get().then(function(col) {
            for (let  [id, data] of Object.entries(col.docs.map(doc => ({id: doc.id, data: doc.data()})))) {
                if(data.data.email === raport.email && data.data.trips.id === raport.trip.id)
                {
                    firestore.collection("/reservations").doc(data.id).delete()
                    firestore.collection("/reports").doc(index).update({
                        resolved: true
                    })
                    console.log("Reservation deleted");
                }
              }
        }).catch(function(error) {
            console.log(error);
        });
      }

    render() {
        const singleRaport = this.props.contents;
        if(singleRaport.resolved === true)
        {
            return (
                <React.Fragment>
                    <div>
                        <div className="ReportName">{singleRaport.email}</div>
                        <div className="ReportType">{singleRaport.type}</div>
                    </div>
                </React.Fragment>
            );

        }
        else
        {
            return (
                <React.Fragment>
                    <div>
                        <div className="ReportNameUnresolved" style={{fontWeight: "bold"}}>>{singleRaport.email}</div>
                        <div className="ReportType">{singleRaport.type}</div>
                        <button onClick={this.resolveFunction}>Resolve</button>
                    </div>
                </React.Fragment>
            );
        }
    }
}

export default Report;