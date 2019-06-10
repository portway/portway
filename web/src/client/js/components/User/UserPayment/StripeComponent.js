import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import {
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
} from 'react-stripe-elements'

import { PATH_SETTINGS } from 'Shared/constants'
import CountryList from 'Shared/countryList'
import { currentOrgId } from 'Libs/currentIds'

import { update } from '../../../api'

const elementStyles = {
  base: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    fontSize: '15px',
    '::placeholder': {
      color: '#d9dbdb'
    }
  },
  focus: {
    border: 'thin solid #6ba5f2'
  },
  complete: {},
  invalid: {
    color: '#f26244',
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

// @todo hook in the Validation state for this so we can be consistent
class StripeComponent extends React.Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      hasError: false,
      errorObject: null
    }
  }

  render() {
    return (
      <form
        id="payment-form"
        action={`http://localHost:3001/api/organizations/${currentOrgId}/billing`}
        method="put"
        onSubmit={this.billingSubmitHandler.bind(this)}
        ref={this.formRef}>

        <div className="form-field form-field--horizontal">
          <div className="field">
            <div>
              <label className="field__label" htmlFor="card-number">
                Credit or debit card
              </label>
              <div className="field__control field__control--card">
                <CardNumberElement
                  id="card-number"
                  style={elementStyles}
                  classes={elementClasses}
                  onReady={(el) => {
                    el.focus()
                  }} />
              </div>
            </div>
            <div>
              <label className="field__label" htmlFor="card-expiry">
                Expiration
              </label>
              <div className="field__control field__control--expiry">
                <CardExpiryElement
                  id="card-expiry"
                  style={elementStyles}
                  classes={elementClasses} />
              </div>
            </div>
            <div>
              <label className="field__label" htmlFor="card-expiry">
                CVC
              </label>
              <div className="field__control field__control--cvc">
                <CardCVCElement id="card-cvc" style={elementStyles} classes={elementClasses} />
              </div>
            </div>
          </div>
        </div>

        <div className="form-field form-field--horizontal">
          <div className="field">
            <div>
              <label className="field__label" htmlFor="country">
                Country
              </label>
              <div className="field__control field__control--country">
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  name="country"
                  options={CountryList} />
              </div>
            </div>
            <div>
              <label className="field__label" htmlFor="state">
                State
              </label>
              <div className="field__control field__control">
                <input
                  id="state"
                  className="input"
                  type="text"
                  name="state"
                  placeholder="Oregon"
                  autoComplete="section-billing address-level1" />
              </div>
            </div>
          </div>
        </div>

        <div className="form-field">
          <div className="field">
            <label className="field__label" htmlFor="postal-code">
                Postal code
            </label>
            <div className="field__control field__control--postal">
              <input
                id="postal-code"
                className="input"
                type="number"
                name="postal-code"
                placeholder="97215"
                autoComplete="section-billing postal-code" />
            </div>
          </div>
        </div>

        <div className="form-field form-field--hidden">
          <div className="field">
            <label className="field__label" htmlFor="plan">
              Plan ID
            </label>
            <div className="field__control">
              <input
                className="input is-static"
                type="text"
                name="planId"
                value="plan_ETYqFpkbcgDast"
                disabled
                readOnly />
            </div>
          </div>
        </div>

        <div className="field field__row field--with-space">
          <div className="field__control field__control--submit">
            <input className="btn" type="submit" value="Update payment information" />
            <Link to={PATH_SETTINGS}>Cancel</Link>
          </div>
        </div>

      </form>
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
    // form.submit()
    update(`http://localHost:3001/api/organizations/${currentOrgId}/billing`, { token: token.id })
  }

  billingSubmitHandler(e) {
    e.preventDefault()
    const cardData = {
      'address_country': this.formRef.current.country.value,
      'address_zip': this.formRef.current.elements['postal-code'].value,
      'address_state': this.formRef.current.elements.state.value
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

StripeComponent.propTypes = {
  stripe: PropTypes.object
}

export default injectStripe(StripeComponent)
