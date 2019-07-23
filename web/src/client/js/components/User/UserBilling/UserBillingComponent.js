import React from 'react'
import UserSeatsContainer from 'Components/User/UserSeats/UserSeatsContainer'
import UserPaymentContainer from 'Components/User/UserPayment/UserPaymentContainer'

import './_UserBillingStyles.scss'

class UserBillingComponent extends React.PureComponent {
  render() {
    return (
      <>
        <section>
          <h2>Billing Overview</h2>
          <div className="invoice">
            Plan info will go here, like your bill per/mo, next payment due
          </div>
        </section>
        <section>
          <h2>Manage Seats</h2>
          <UserSeatsContainer />
        </section>
        <section>
          <h2>Payment information</h2>
          <UserPaymentContainer />
        </section>
      </>
    )
  }
}

export default UserBillingComponent
