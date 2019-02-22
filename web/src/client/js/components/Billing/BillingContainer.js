import React from 'react'
import { StripeProvider } from 'react-stripe-elements'
import BillingComponent from './BillingComponent'

class BillingContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      isTrusted: false,
      stripeKey: 'pk_test_1pwhBFZzMbjvUlsgn2EjsfWP',
      stripe: null
    }
    // Load stripe library dynamically
    if (typeof Stripe === 'undefined') {
      const stripeScript = document.createElement('script')
      stripeScript.onerror = this.stripeErrorHandler.bind(this)
      stripeScript.onload = this.stripeLoadedHandler.bind(this)
      stripeScript.src = 'https://js.stripe.com/v3/'
      document.body.appendChild(stripeScript)
    }
  }

  render() {
    return (
      <div className="billing-container">
        <StripeProvider stripe={this.state.stripe}>
          <BillingComponent />
        </StripeProvider>
      </div>
    )
  }

  stripeLoadedHandler(data) {
    // If we've loaded Stripe successfully, render the component
    this.setState({
      loading: false,
      isTrusted: data.isTrusted,
      stripe: window.Stripe(this.state.stripeKey)
    })
  }

  stripeErrorHandler(err) {
    if (err) {
      throw new URIError('Error loading Stripe.')
    }
  }
}

export default BillingContainer
