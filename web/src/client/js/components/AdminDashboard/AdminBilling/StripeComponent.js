import React from 'react'
import PropTypes from 'prop-types'
import {
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  Elements
} from 'react-stripe-elements'
import MessageContainer from 'Components/Message/MessageContainer'

import './AdminBillingStyles.scss'

const elementStyles = {
  base: {},
  invalid: {
    color: 'red',
    ':focus': {
      color: '#FA755A'
    },
    '::placeholder': {
      color: '#FFCCA5'
    }
  }
}

const elementClasses = {
  focus: 'focus',
  empty: 'empty',
  invalid: 'invalid'
}

class AdminBillingForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      errorObject: null
    }
  }

  renderMessages() {
    if (this.state.hasError) {
      return (
        <MessageContainer visible={true} type="error" message={this.state.errorObject.message} />
      )
    }
  }

  render() {
    return (
      <Elements>
        <form
          id="payment-form"
          action="http://localHost:3001/api/billing"
          onSubmit={this.billingSubmitHandler.bind(this)}
          method="post">
          {this.renderMessages()}
          <div className="field">
            <label className="label" htmlFor="card-number">
              Credit or debit card
            </label>
            <div className="control">
              <CardNumberElement
                id="card-number"
                style={elementStyles}
                classes={elementClasses}
                onReady={(el) => {
                  el.focus()
                }} />
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-body">
              <div className="field">
                <label className="label" htmlFor="card-expiry">
                  Expiration (MM/YY)
                </label>
                <div className="control">
                  <CardExpiryElement
                    id="card-expiry"
                    style={elementStyles}
                    classes={elementClasses} />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="card-expiry">
                  CVC
                </label>
                <div className="control">
                  <CardCVCElement id="card-cvc" style={elementStyles} classes={elementClasses} />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="zip-code">
                  Zip code
                </label>
                <div className="control">
                  <input
                    id="zip-code"
                    className="input"
                    type="number"
                    name="zip-code"
                    placeholder="97215"
                    autoComplete="section-billing postal-code" />
                </div>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="email">
              Your email
            </label>
            <div className="control">
              <input
                id="email"
                className="input"
                type="email"
                name="email"
                placeholder="email@domain.com"
                autoComplete="section-billing username" />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="plan">
              Plan ID
            </label>
            <div className="control">
              <input
                className="input is-static"
                type="text"
                name="planId"
                value="plan_ETYqFpkbcgDast"
                disabled
                readOnly />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input className="button is-primary" type="submit" value="Submit Payment" />
            </div>
          </div>
        </form>
      </Elements>
    )
  }

  stripeTokenHandler(token) {
    const form = document.getElementById('payment-form')
    const hiddenInput = document.createElement('input')
    hiddenInput.setAttribute('type', 'hidden')
    hiddenInput.setAttribute('name', 'token')
    hiddenInput.setAttribute('value', token.id)
    form.appendChild(hiddenInput)
    // Submit the form
    form.submit()
  }

  billingSubmitHandler(e) {
    e.preventDefault()
    const cardData = {
      email: document.getElementById('email').value,
      postalCode: document.getElementById('zip-code').value
    }
    this.props.stripe.createToken(cardData).then((result) => {
      if (result.error) {
        // Inform the user if there was an error
        this.setState({
          hasError: true,
          errorObject: result.error
        })
        return
      } else {
        // Send the token to your server
        this.setState({
          hasError: false,
          errorObject: null
        })
        this.stripeTokenHandler(result.token)
      }
    })
  }
}

AdminBillingForm.propTypes = {
  stripe: PropTypes.object
}

export default injectStripe(AdminBillingForm)
