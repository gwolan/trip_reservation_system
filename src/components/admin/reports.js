import React, { Component } from 'react';
import  {firestore}  from '../../utilities/base';
import Report from './report';
import './../../styles/Report.css'

class Reports extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: []
        }
    }

    componentWillMount() {
        const reportsList = this;

        firestore.collection("/reports").orderBy("createdat", "desc").get().then(function(col) {
            reportsList.setReportList(col.docs.map(doc => ({id: doc.id, data: doc.data()})))
        }).catch(function(error) {
            console.log(error);
        });
    }

    setReportList(reports) {
        this.setState({
            list: reports
        })
    }

    render() {
        return (
            <div>
                <div>
                    <h3 className="ReportListName">Reservations to cancel</h3>
                </div>
                <ul className="ReportsList">
                    {this.state.list.map( (report)=> <li key={report.id} className="Report">< Report id={report.id} contents={report.data} /></li>)}
                </ul>
            </div>
        )
    }
}

export default Reports;