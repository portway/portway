import React from 'react'

import FlashComponent from 'Components/Flash/FlashComponent'

const AccountLocked = () => {
  return (
    <FlashComponent className="admin-notices__notice" type="error">
      <div className="admin-notices__notice-title">
        <div className="admin-notices__notice-title-content">
          <h2 className="danger">Past due</h2>
          <p className="note">We cannot successfully bill you with your current payment information.</p>
        </div>
      </div>
      <p>Please <a href="#payment">update your payment information below</a> to activate your account.</p>
    </FlashComponent>
  )
}

AccountLocked.propTypes = {
}

export default AccountLocked
