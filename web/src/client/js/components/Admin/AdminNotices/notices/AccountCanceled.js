import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { SUPPORT_EMAIL } from 'Shared/constants'
import FlashComponent from 'Components/Flash/FlashComponent'

const AccountCanceled = ({ subscription }) => {
  return (
    <FlashComponent className="admin-notices__notice" type="error">
      <div className="admin-notices__notice-title">
        <div className="admin-notices__notice-title-content">
          <h2 className="danger">Account canceled</h2>
        </div>
      </div>
      <p>
        Your current period ends <b>{moment.unix(subscription.cancelAt || subscription.currentPeriodEnd).format('MMMM Do, YYYY')}</b>.
        You have access to your projects and documents until then.
      </p>
      <p>
        If you need assistance, please email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </FlashComponent>
  )
}

AccountCanceled.propTypes = {
  subscription: PropTypes.object,
}

export default AccountCanceled
