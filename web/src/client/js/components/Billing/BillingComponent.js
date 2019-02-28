import React from 'react'
import { Elements } from 'react-stripe-elements'

import BillingForm from './BillingForm'

class BillingComponent extends React.PureComponent {
  render() {
    return (
      <Elements>
        <BillingForm />
      </Elements>
    )
  }
}

export default BillingComponent
