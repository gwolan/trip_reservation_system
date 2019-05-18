import React, { Component } from 'react';
import  {firestore}  from '../../utilities/base';
import './../../styles/Report.css';

class Report extends Component {

    constructor(props) {
        super(props);
        this.deleteFunction = this.deleteFunction.bind(this);
        this.editFunction = this.editFunction.bind(this);
        this.hideEditFunction = this.hideEditFunction.bind(this);
        this.saveEditFunction = this.saveEditFunction.bind(this);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleParticipantsChange = this.handleParticipantsChange.bind(this);

        this.state = {
            resolved: this.props.contents.resolved,
            edit: false,
            name: "",
            lastName: "",
            participants: 0,
            reservation: null
        };
      }

      deleteFunction(e) {
        const index = this.props.id;
        const report = this.props.contents;
        e.preventDefault();
        report.reservation.delete().then( () => {
            firestore.collection("/reports").doc(index).update({
                resolved: true
            }).then(() => {
                console.log("Reservation deleted")
            }).catch((error) => {
                console.log(error)
            })
        }).catch((error) => {
            console.log(error)
        })

        this.setState({
            edit: false,
            resolved: true
          })
      }

      editFunction(e) {
        const report = this.props.contents;
        e.preventDefault();

        report.reservation.get().then( (reservationDoc) => {
            if(reservationDoc.exists) {
                this.setState({
                    name: reservationDoc.get("name"),
                    lastName: reservationDoc.get("lastName"),
                    participants: reservationDoc.get("participants"),
                    reservation: reservationDoc.data()
                })
            }
            else {
                this.setState({
                    name: null,
                    lastName: null,
                    participants: null,
                    reservation: null,
                })
            }
        }).catch(function(error) {
            console.log(error);
        });

        this.setState({
            edit: true
        })
      }

      hideEditFunction(e) {
        e.preventDefault();
        this.setState({
            edit: false
          })
      }

      saveEditFunction(e) {
        const report = this.props.contents;
        e.preventDefault();
        report.reservation.update({
            name: this.state.name,
            lastName: this.state.lastName,
            participants: this.state.participants
        })
        firestore.collection("/reports").doc(this.props.id).update({
            resolved: true
        })
        this.setState({
            edit: false,
            resolved: true
          })
      }

      handleNameChange(event) {
        this.setState({name: event.target.value});
      }

      handleLastNameChange(event) {
        this.setState({lastName: event.target.value});
      }

      handleParticipantsChange(event) {
        this.setState({participants: event.target.value});
      }

    render() {
        const singleReport = this.props.contents;

        if(this.state.edit === true)
        {
            if(this.state.reservation === null)
            {
                return (
                    <React.Fragment>
                        
                        <div>
                            <div className="ReportName">{singleReport.email}</div>
                            <div className="ReportType">{singleReport.type}</div>
                            <div>Reservation does not exist</div>
                            <button className ="ReportButton" onClick={this.hideEditFunction}>Hide</button>
                        </div>
                    </React.Fragment>
                );
            }
            else
            {
                return (
                    <React.Fragment>
                        <div>
                            <div className="ReportNameUnresolved" style={{fontWeight: "bold"}}>>{singleReport.email}</div>
                            <div className="ReportType">{singleReport.type}</div>
                            <div>
                                <label>
                                    Name: 
                                    <input style={{width: "100%"}} name="name" onChange={this.handleNameChange} value={this.state.name}></input>
                                </label>
                            </div>
                            <div>
                                <label>
                                    Last Name: 
                                    <input style={{width: "100%"}} name="name" onChange={this.handleLastNameChange} value={this.state.lastName}></input>
                                </label>
                            </div>
                            <div>
                                <label>
                                    Participants: 
                                    <input style={{width: "100%"}} name="name" onChange={this.handleParticipantsChange} value={this.state.participants}></input>
                                </label>
                            </div>
                            <button className ="ReportButton" onClick={this.deleteFunction}>Delete</button>
                            <button className ="ReportButton" onClick={this.hideEditFunction}>Hide</button>
                            <button className ="ReportButton" onClick={this.saveEditFunction}>Save</button>
                        </div>
                    </React.Fragment>
                );
            }
        }
        else
        {
            if(this.state.resolved === true)
            {
                return (
                    <React.Fragment>
                        <div>
                            <div className="ReportName">{singleReport.email}</div>
                            <div className="ReportType">{singleReport.type}</div>
                            <button className ="ReportButton" onClick={this.editFunction}>Edit</button>
                        </div>
                    </React.Fragment>
                );
            }
            else
            {
                return (
                    <React.Fragment>
                        <div>
                            <div className="ReportNameUnresolved" style={{fontWeight: "bold"}}>>{singleReport.email}</div>
                            <div className="ReportType">{singleReport.type}</div>
                            <button className ="ReportButton" onClick={this.editFunction}>Edit</button>
                        </div>
                    </React.Fragment>
                );
            }
        }  
    }
}

export default Report;