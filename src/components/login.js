import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Toaster, Intent } from '@blueprintjs/core'
import { app} from '../base'

const loginStyles = {
  width: "90%",
  maxWidth: "315px",
  margin: "20px auto",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px"
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
    const { from } = this.props.location.state || { from: { pathname: '/admin' } }

    if (this.state.redirect === true) {
      return <Redirect to={'/admin'} />
    }

    return (
      
      <div style={loginStyles}>
        <Toaster ref={(element) => { this.toaster = element }} />
        <form onSubmit={(event) => { this.authWithEmailPassword(event) }} ref={(form) => { this.loginForm = form }}>
          <label className="pt-label">
            Email
            <input style={{width: "100%"}} className="pt-input" name="email" type="email" ref={(input) => { this.emailInput = input }} placeholder="Email"></input>
          </label>
          <label className="pt-label">
            Password
            <input style={{width: "100%"}} className="pt-input" name="password" type="password" ref={(input) => { this.passwordInput = input }} placeholder="Password"></input>
          </label>
          <hr style={{marginTop: "10px", marginBottom: "10px"}}/>
          <input style={{width: "100%"}} type="submit" className="pt-button pt-intent-primary" value="Log In"></input>
        </form>
      </div>
    )
  }
}
export default Login