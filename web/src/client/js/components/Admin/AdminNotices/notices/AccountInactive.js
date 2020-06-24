import React from 'react'

import FlashComponent from 'Components/Flash/FlashComponent'

const AccountInactive = () => {
  return (
    <FlashComponent className="admin-notices__notice" type="error">
      <div className="admin-notices__notice-title">
        <div className="admin-notices__notice-title-content">
          <h2 className="danger">Inactive</h2>
        </div>
      </div>
      <p>Thanks for checking out Portway! We are in the process of removing your account.</p>
    </FlashComponent>
  )
}

AccountInactive.propTypes = {
}

export default AccountInactive
