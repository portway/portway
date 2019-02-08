import React from 'react'
import { render } from 'react-dom'
import MessageComponent from '../components/MessageComponent'

// Create a Stripe client.
const stripe = Stripe('pk_test_1pwhBFZzMbjvUlsgn2EjsfWP')
// Create an instance of Elements.
// Todo: pass whatever font here
// https://github.com/stripe/elements-examples/blob/master/js/example1.js
const elements = stripe.elements()

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
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

const cardNumber = elements.create('cardNumber', {
  style: elementStyles,
  classes: elementClasses
})
cardNumber.mount('#card-number')

const cardExpiry = elements.create('cardExpiry', {
  style: elementStyles,
  classes: elementClasses
})
cardExpiry.mount('#card-expiry')

const cardCvc = elements.create('cardCvc', {
  style: elementStyles,
  classes: elementClasses
})
cardCvc.mount('#card-cvc')

function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form')
  var hiddenInput = document.createElement('input')
  hiddenInput.setAttribute('type', 'hidden')
  hiddenInput.setAttribute('name', 'token')
  hiddenInput.setAttribute('value', token.id)
  form.appendChild(hiddenInput)
  // Submit the form
  form.submit()
}

function createToken() {
  const cardData = {
    address_zip: document.getElementById('zip-code').value
  }
  stripe.createToken(cardNumber, cardData).then(function(result) {
    if (result.error) {
      console.log(result)
      // Inform the user if there was an error
      render(
        <MessageComponent visible={true} type="error" message={result.error.message} />,
        document.getElementById('message-mount')
      )
      return
    } else {
      // Send the token to your server
      stripeTokenHandler(result.token)
    }
  })
}

// Create a token when the form is submitted.
var form = document.getElementById('payment-form')
form.addEventListener('submit', function(e) {
  e.preventDefault()
  createToken()
})

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept()
}
