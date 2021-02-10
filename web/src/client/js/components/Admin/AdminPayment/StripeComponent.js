import React, { lazy, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
const Select = lazy(() => import('react-select'))

import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js'

import { PATH_BILLING } from 'Shared/constants'
import { hiddenFieldStyles, lightModeStyles, darkModeStyles } from './StripeComponentStyles'
import CountryList from 'Shared/countryList'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

const gray10 = getComputedStyle(document.documentElement).getPropertyValue('--color-gray-10')

const elementClasses = {
  focus: 'focus',
  empty: 'empty',
  invalid: 'invalid'
}

const StripeComponent = ({ isSubmitting, updateBillingHandler }) => {
  const formRef = useRef()
  const [stripeStyles, setStripeStyles] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches ? darkModeStyles : lightModeStyles)
  const [countryValue, setCountryValue] = useState('')

  const stripe = useStripe()
  const elements = useElements()

  function colorSchemeChangeHandler(event) {
    if (event.matches) {
      setStripeStyles(darkModeStyles)
    } else {
      setStripeStyles(lightModeStyles)
    }
  }

  useEffect(() => {
    if (window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setStripeStyles(darkModeStyles)
      }
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', colorSchemeChangeHandler, { passive: false })
    }
    return () => {
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', colorSchemeChangeHandler, { passive: false })
      }
    }
  }, [])

  function stripeTokenHandler(token) {
    if (!isSubmitting) {
      const hiddenInput = document.createElement('input')
      hiddenInput.setAttribute('type', 'hidden')
      hiddenInput.setAttribute('name', 'token')
      hiddenInput.setAttribute('value', token.id)
      formRef.current.appendChild(hiddenInput)
      updateBillingHandler(token)
    }
  }

  function billingSubmitHandler(e) {
    e.preventDefault()
    if (!stripe || !elements) return

    const cardElement = elements.getElement(CardNumberElement)
    const cardData = {
      'address_country': formRef.current.elements.country.value,
      'address_zip': formRef.current.elements['postal-code'].value,
      'address_state': formRef.current.elements.state.value
    }
    stripe.createToken(cardElement, cardData).then((result) => {
      if (result.error) {
        // Inform the user if there was an error
        console.error(result.error)
        return
      } else {
        // Send the token to your server
        stripeTokenHandler(result.token)
      }
    })
  }

  return (
    <form
      method="put"
      name="payment-form"
      onSubmit={billingSubmitHandler}
      ref={formRef}>

      <div className="field-container field-container--row">
        <div className="field">
          <label className="field__label" htmlFor="card-number">
            Credit or debit card
          </label>
          <div className="field__control field__control--card">
            <CardNumberElement
              id="card-number"
              options={{ style: stripeStyles }}
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
              options={{ style: stripeStyles }}
              classes={elementClasses} />
          </div>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="card-expiry">
            CVC
          </label>
          <div className="field__control field__control--cvc">
            <CardCvcElement id="card-cvc" options={{ style: stripeStyles }} classes={elementClasses} />
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
              value={CountryList.filter(option => option.label === 'United States')}
              name="country"
              options={CountryList}
              onChange={(option) => {
                setCountryValue(option.value)
              }}
            />
            <input
              className="admin-payment__hidden-field"
              tabIndex={-1}
              autoComplete="off"
              style={hiddenFieldStyles}
              value={countryValue}
              readOnly
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
              style={{ textTransform: 'uppercase' }}
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
              disabled={isSubmitting}
              type="submit"
              value="Update payment information"
            />
          </div>
        </div>
        <div className="field">
          <div className="field__control">
            <Link
              className="btn btn--blank btn--small"
              disabled={isSubmitting}
              to={PATH_BILLING}
            >Cancel</Link>
          </div>
        </div>
        <div className="field">
          {isSubmitting && <SpinnerComponent color={gray10} />}
        </div>
      </div>

    </form>
  )
}

StripeComponent.propTypes = {
  isSubmitting: PropTypes.bool,
  stripe: PropTypes.object,
  updateBillingHandler: PropTypes.func.isRequired,
}

export default StripeComponent
