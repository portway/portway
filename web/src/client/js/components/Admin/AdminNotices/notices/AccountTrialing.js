import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { PLAN_TITLES, PLAN_TYPES } from 'Shared/constants'
import FlashComponent from 'Components/Flash/FlashComponent'

const AccountTrialing = ({ trialEndDate }) => {
  const trialEndsInDays = moment(trialEndDate).fromNow()
  return (
    <FlashComponent className="admin-notices__notice">
      <div className="admin-notices__notice-title">
        <div className="admin-notices__notice-title-content">
          <h2>Your trial ends {trialEndDate && <>{trialEndsInDays}, on {moment(trialEndDate).format('MMMM Do')}</>}</h2>
          <p className="note">
            During your trial, you are limited to a {PLAN_TITLES[PLAN_TYPES.SINGLE_USER]}. Have fun!
          </p>
        </div>
      </div>
      <p>
        <a href="#payment">Add your payment information below</a> to activate your account or to upgrade to a {PLAN_TITLES[PLAN_TYPES.MULTI_USER]}.
      </p>
    </FlashComponent>
  )
}

AccountTrialing.propTypes = {
  trialEndDate: PropTypes.date,
}

export default AccountTrialing
