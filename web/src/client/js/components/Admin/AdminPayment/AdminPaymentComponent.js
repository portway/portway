import React, { useState } from 'react'

import StripeContainer from './StripeContainer'
import './AdminPaymentStyles.scss'

const AdminPaymentComponent = () => {
  const [isStripeOpen, setStripeOpen] = useState(false)
  return (
    <div className="admin-payment">
      {!isStripeOpen &&
      <>
        <div className="admin-payment__method">
          <span className="admin-payment__card-type">Visa</span> ending in <span className="admin-payment__card-ending">1004</span>
          <span className="admin-payment__card-expiration">Expires on 06/23</span>
        </div>
        <button className="btn btn--small" onClick={() => { setStripeOpen(true) }}>Edit Payment Info</button>
      </>
      }
      {isStripeOpen &&
      <>
        <p>Enter your new card information. We will use this new form of payment from now on.</p>
        <StripeContainer />
      </>
      }
    </div>
  )
}

AdminPaymentComponent.propTypes = {
}

export default AdminPaymentComponent
