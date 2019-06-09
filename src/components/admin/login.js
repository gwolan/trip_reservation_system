import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Toaster, Intent } from '@blueprintjs/core'
import { app} from '../../utilities/base'
import './../../styles/Login.css';

const loginStyles = {
  width: "90%",
  maxWidth: "315px",
  margin: "20px auto",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px",
  background: "#883333"
}

class Login extends Component {
  constructor(props) {
    super(props)
    this.authWithEmailPassword = this.authWithEmailPassword.bind(this)
    this.state = {
        redirect: false
      }
  }

  authWithEmailPassword(event) {
    event.preventDefault()

    const email = this.emailInput.value
    const password = this.passwordInput.value

    app.auth().fetchSignInMethodsForEmail(email)
      .then((providers) => {
          return app.auth().signInWithEmailAndPassword(email, password)
      })
      .then((user) => {
        if (user && user.email) {
          this.loginForm.reset()
          this.props.setCurrentUser(user)
          this.setState({redirect: true})
 
        }
      })
      .catch((error) => {
        this.toaster.show({ intent: Intent.DANGER, message: error.message })
      })
  }

  render() {
    if (this.state.redirect === true) {
      return <Redirect to={'/admin'} />
    }

    return (
      
      <div style={loginStyles}>
        <Toaster ref={(element) => { this.toaster = element }} />
        <form onSubmit={(event) => { this.authWithEmailPassword(event) }} ref={(form) => { this.loginForm = form }}>
          <div className="background">
            <label className="label">
              Email
            </label>  
          </div>
            <input className="textfield" name="email" type="email" ref={(input) => { this.emailInput = input }} placeholder="Email"></input>
          
          <label className="label">
            Password
          </label>  
            <input className="textfield" name="password" type="password" ref={(input) => { this.passwordInput = input }} placeholder="Password"></input>
          
          <hr style={{marginTop: "10px", marginBottom: "10px"}}/>
          <input style={{width: "100%"}} type="submit" value="Log In"></input>
        </form>
      </div>
    )
  }
}
export default Login