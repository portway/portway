import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import {
  ORG_SUBSCRIPTION_STATUS,
  ORGANIZATION_ROLE_IDS,
  PATH_BILLING
} from 'Shared/constants'

function getLockedLanguageFor(orgSubscriptionStatus) {
  switch (orgSubscriptionStatus) {
    case ORG_SUBSCRIPTION_STATUS.TRIAL_ENDED:
      return {
        title: 'Trial ended',
        owner: <><p>Thanks for checking out Portway! We’re sad to see you go. Your account will be completely erased soon.</p><Link to={PATH_BILLING} className="btn">Upgrade now</Link></>,
        user: <><p>Your organization’s trial has ended. Contact your organization owner.</p></>
      }
    default:
      return {
        title: 'Account locked',
        owner: <><p>There is a payment issue with your account. Please check your billing &amp; payment information.</p><Link to={PATH_BILLING} className="btn">Fix</Link></>,
        user: <><p>There is a payment issue with your account. Contact your organization owner.</p></>
      }
  }
}

const LockedViewComponent = ({ userRole, organization }) => {
  const lockedLanguage = getLockedLanguageFor(organization.subscriptionStatus)
  return (
    <section>
      <div className="notice">
        <h2 className="notice__header">{lockedLanguage.title}</h2>
        {userRole === ORGANIZATION_ROLE_IDS.OWNER && lockedLanguage.owner}
        {userRole !== ORGANIZATION_ROLE_IDS.OWNER && lockedLanguage.user}
      </div>
    </section>
  )
}

LockedViewComponent.propTypes = {
  organization: PropTypes.object,
  userRole: PropTypes.number,
}

export default LockedViewComponent
