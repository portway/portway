import React from 'react'
import AdminSeatsContainer from 'Components/Admin/AdminSeats/AdminSeatsContainer'
import AdminPaymentComponent from 'Components/Admin/AdminPayment/AdminPaymentComponent'

import './AdminBillingStyles.scss'

class AdminBillingComponent extends React.PureComponent {
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
          <AdminSeatsContainer />
        </section>
        <section>
          <h2>Payment information</h2>
          <AdminPaymentComponent />
        </section>
      </>
    )
  }
}

export default AdminBillingComponent
