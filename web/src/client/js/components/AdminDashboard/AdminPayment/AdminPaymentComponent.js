import React from 'react'

import './AdminPaymentStyles.scss'

const AdminPaymentComponent = () => {
  return (
    <div className="admin-payment">
      <div className="admin-payment__method">
        <span className="admin-payment__card-type">Visa</span> ending in <span className="admin-payment__card-ending">1004</span>
        <span className="admin-payment__card-expiration">Expires on 06/23</span>
      </div>
    </div>
  )
}

AdminPaymentComponent.propTypes = {
}

export default AdminPaymentComponent
