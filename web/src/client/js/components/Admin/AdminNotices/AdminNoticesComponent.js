import React, { lazy } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { LOCKED_ACCOUNT_STATUSES, ORG_SUBSCRIPTION_STATUS, TRIALING_STATUSES } from 'Shared/constants'

const AccountTrialing = lazy(() => import(/* webpackChunkName: 'AccountTrialing' */ './notices/AccountTrialing'))
const AccountTrialEnded = lazy(() => import(/* webpackChunkName: 'AccountTrialEnded' */ './notices/AccountTrialEnded'))
const AccountLocked = lazy(() => import(/* webpackChunkName: 'AccountLocked' */ './notices/AccountLocked'))
const AccountInactive = lazy(() => import(/* webpackChunkName: 'AccountInactive' */ './notices/AccountInactive'))
const AccountCanceled = lazy(() => import(/* webpackChunkName: 'AccountCanceled' */ './notices/AccountCanceled'))

import './_AdminNotices.scss'

const AdminNoticesComponent = ({ organization, subscription }) => {
  const lockedAccountStatusesMinusInactive = LOCKED_ACCOUNT_STATUSES.filter((status) => {
    // Both of these are considered LOCKED, but we give different status messages in these cases
    return status !== ORG_SUBSCRIPTION_STATUS.INACTIVE && status !== ORG_SUBSCRIPTION_STATUS.TRIAL_ENDED
  })

  const trialEnds = moment.unix(subscription.trialEnd)

  function getAdminNotice() {
    // For all active trialing accounts
    if (TRIALING_STATUSES.includes(organization.subscriptionStatus)) {
      return <AccountTrialing trialEndDate={trialEnds} />
    }
    // For all locked accounts, past due
    if (lockedAccountStatusesMinusInactive.includes(organization.subscriptionStatus)) {
      return <AccountLocked />
    }
    switch (organization.subscriptionStatus) {
      case ORG_SUBSCRIPTION_STATUS.TRIAL_ENDED:
        // Trial has ended, they can still update their payment info until the account deletes
        return <AccountTrialEnded />
      case ORG_SUBSCRIPTION_STATUS.INACTIVE:
        // For inactive accounts - deleting soon
        return <AccountInactive />
      case ORG_SUBSCRIPTION_STATUS.PENDING_CANCEL:
        return <AccountCanceled subscription={subscription} />
      default:
        return null
    }
  }

  return (
    <div className="admin-notices">
      {getAdminNotice()}
    </div>
  )
}

AdminNoticesComponent.propTypes = {
  organization: PropTypes.object.isRequired,
  subscription: PropTypes.object,
}

AdminNoticesComponent.defaultProps = {
  subscription: {}
}

export default AdminNoticesComponent
