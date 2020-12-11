import React, { lazy } from 'react'
import PropTypes from 'prop-types'
const Select = lazy(() => import('react-select'))
import {
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
} from 'react-stripe-elements'

import CountryList from 'Shared/countryList'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

const gray10 = getComputedStyle(document.documentElement).getPropertyValue('--color-gray-10')

const lightModeStyles = {
  base: {
    color: '#333333',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    fontSize: '15px',
    '::placeholder': {
      color: '#999999'
    }
  },
  focus: {
    border: `thin solid #6074D6`
  },
  complete: {},
  invalid: {
    color: '#F55961',
    ':focus': {
      color: '#FBBCBF'
    },
    '::placeholder': {
      color: '#FBBCBF'
    }
  }
}

const darkModeStyles = {
  base: {
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    fontSize: '15px',
    '::placeholder': {
      color: '#666666'
    }
  },
  focus: {
    border: `thin solid #6074D6`
  },
  complete: {},
  invalid: {
    color: '#F55961',
    ':focus': {
      color: '#FBBCBF'
    },
    '::placeholder': {
      color: '#FBBCBF'
    }
  }
}

const hiddenFieldStyles = {
  height: 0,
  opacity: 0,
  minHeight: 'unset',
  padding: 0,
  position: 'absolute',
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
    this.cardRef = React.createRef()
    this.state = {
      stripeStyles: window.matchMedia('(prefers-color-scheme: dark)').matches ? darkModeStyles : lightModeStyles,
      hasError: false,
      errorObject: null,
      countryValue: null,
    }
  }

  colorSchemeChangeHandler(event) {
    if (event.matches) {
      this.setState({ stripeStyles: darkModeStyles })
    } else {
      this.setState({ stripeStyles: lightModeStyles })
    }
  }

  componentDidMount() {
    if (window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setState({ stripeStyles: darkModeStyles })
      }
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.colorSchemeChangeHandler.bind(this), { passive: false })
    }
  }

  componentWillUnmount() {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.colorSchemeChangeHandler.bind(this), { passive: false })
    }
  }

  render() {
    return (
      <form
        method="put"
        name="payment-form"
        onSubmit={this.billingSubmitHandler.bind(this)}
        ref={this.formRef}>

        <div className="field-container field-container--row">
          <div className="field">
            <label className="field__label" htmlFor="card-number">
              Credit or debit card
            </label>
            <div className="field__control field__control--card">
              <CardNumberElement
                id="card-number"
                style={this.state.stripeStyles}
                classes={elementClasses}
                onReady={(el) => {
                  el.focus()
                }} />
            </div>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="card-expiry">
              Expiration
            </label>
            <div className="field__control field__control--expiry">
              <CardExpiryElement
                id="card-expiry"
                style={this.state.stripeStyles}
                classes={elementClasses} />
            </div>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="card-expiry">
              CVC
            </label>
            <div className="field__control field__control--cvc">
              <CardCVCElement id="card-cvc" style={this.state.stripeStyles} classes={elementClasses} />
            </div>
          </div>
        </div>

        <div className="field-container field-container--row">
          <div className="field">
            <label className="field__label" htmlFor="country">
              Country
            </label>
            <div className="field__control field__control--country">
              <Select
                className="react-select-container"
                classNamePrefix="react-select"
                name="country"
                options={CountryList}
                onChange={(option) => {
                  this.setState({ countryValue: option.value })
                }}
              />
              <input
                className="admin-payment__hidden-field"
                tabIndex={-1}
                autoComplete="off"
                style={hiddenFieldStyles}
                value={this.state.countryValue}
                type="text"
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="state">
              State
            </label>
            <div className="field__control field__control--state">
              <input
                autoComplete="section-billing address-level1"
                className="input"
                id="state"
                name="state"
                placeholder="OR"
                required
                type="text"
              />
            </div>
          </div>
        </div>

        <div className="field-container">
          <div className="field">
            <label className="field__label" htmlFor="postal-code">
                Postal code
            </label>
            <div className="field__control field__control--postal">
              <input
                autoComplete="section-billing postal-code"
                className="input"
                id="postal-code"
                name="postal-code"
                placeholder="97215"
                required
                type="number"
              />
            </div>
          </div>
        </div>

        <div className="field-container field-container__hidden">
          <div className="field">
            <label className="field__label" htmlFor="plan">
              Plan ID
            </label>
            <div className="field__control">
              <input
                className="input is-static"
                type="hidden"
                name="planId"
                value="plan_ETYqFpkbcgDast"
                disabled
                readOnly />
            </div>
          </div>
        </div>

        <div className="field-container field-container--row">
          <div className="field">
            <div className="field__control field__control--submit">
              <input
                className="btn"
                disabled={this.props.isSubmitting}
                type="submit"
                value="Update payment information"
              />
            </div>
          </div>
          {this.props.cancelHandler &&
          <div className="field">
            <div className="field__control">
              <button
                className="btn btn--blank btn--small"
                disabled={this.props.isSubmitting}
                onClick={this.props.cancelHandler}
              >Cancel</button>
            </div>
          </div>
          }
          <div className="field">
            {this.props.isSubmitting && <SpinnerComponent color={gray10} />}
          </div>
        </div>

      </form>
    )
  }

  stripeTokenHandler(token) {
    if (!this.props.isSubmitting) {
      const hiddenInput = document.createElement('input')
      hiddenInput.setAttribute('type', 'hidden')
      hiddenInput.setAttribute('name', 'token')
      hiddenInput.setAttribute('value', token.id)
      this.formRef.current.appendChild(hiddenInput)
      this.props.updateBillingHandler(token)
    }
  }

  billingSubmitHandler(e) {
    e.preventDefault()
    const cardData = {
      'address_country': this.formRef.current.elements.country.value,
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
  cancelHandler: PropTypes.func,
  isSubmitting: PropTypes.bool,
  stripe: PropTypes.object,
  updateBillingHandler: PropTypes.func.isRequired,
}

export default injectStripe(StripeComponent)
