import React from 'react'
import UserSeatsContainer from 'Components/User/UserSeats/UserSeatsContainer'
import UserPaymentComponent from 'Components/User/UserPayment/UserPaymentComponent'

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
          <UserPaymentComponent />
        </section>
      </>
    )
  }
}

export default UserBillingComponent
