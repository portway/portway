import React from 'react'
import { Link } from 'react-router-dom'

import { PATH_PAYMENT } from 'Shared/constants'
import FlashComponent from 'Components/Flash/FlashComponent'

const AccountTrialEnded = () => {
  return (
    <FlashComponent className="admin-notices__notice" type="warning">
      <div className="admin-notices__notice-title">
        <div className="admin-notices__notice-title-content">
          <h2>Your trial has ended</h2>
          <p className="note">
            Thanks for checking out Portway! We’re sad to see you go.
            Your account will be completely erased soon.
            <br />If you change your mind you can <Link to={PATH_PAYMENT}>activate your account now</Link>.
          </p>
        </div>
      </div>
      <p>
        <Link to={PATH_PAYMENT}>Add your payment information below</Link> to activate your account.
      </p>
    </FlashComponent>
  )
}

AccountTrialEnded.propTypes = {
}

export default AccountTrialEnded
