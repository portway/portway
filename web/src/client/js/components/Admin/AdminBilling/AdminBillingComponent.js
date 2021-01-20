import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { PLAN_TYPES, ORG_SUBSCRIPTION_STATUS } from 'Shared/constants'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import AdminNoticesContainer from 'Components/Admin/AdminNotices/AdminNoticesContainer'
import AdminSeatsContainer from 'Components/Admin/AdminSeats/AdminSeatsContainer'
import AdminPaymentContainer from 'Components/Admin/AdminPayment/AdminPaymentContainer'
import AdminCancelAccountContainer from 'Components/Admin/AdminCancelAccount/AdminCancelAccountContainer'

import './_AdminBilling.scss'

const AdminBillingComponent = ({ organization }) => {
  const disabledSubscriptionStatuses = [
    ORG_SUBSCRIPTION_STATUS.PENDING_CANCEL,
    ORG_SUBSCRIPTION_STATUS.INACTIVE,
  ]
  const sectionClasses = cx({
    ' section--disabled': disabledSubscriptionStatuses.includes(organization.subscriptionStatus)
  })

  return (
    <>
      <AdminNoticesContainer />
      <OrgPlanPermission acceptedPlans={[PLAN_TYPES.MULTI_USER, PLAN_TYPES.PER_USER, PLAN_TYPES.SINGLE_USER]} acceptedSubscriptionStatuses={[ORG_SUBSCRIPTION_STATUS.ACTIVE, ORG_SUBSCRIPTION_STATUS.TRIALING_PENDING_ACTIVE]}>
        <section id="seats" className={sectionClasses}>
          <h2>Manage seats</h2>
          <AdminSeatsContainer />
        </section>
        <hr />
      </OrgPlanPermission>
      {/* null is a special case for seed org */}
      <OrgPlanPermission acceptedPlans={[null, PLAN_TYPES.SINGLE_USER, PLAN_TYPES.MULTI_USER, PLAN_TYPES.PER_USER]}>
        <section id="payment" className={sectionClasses}>
          <h2>Payment information</h2>
          <AdminPaymentContainer />
        </section>
        <hr />
      </OrgPlanPermission>
      <section id="cancel" className={sectionClasses}>
        <AdminCancelAccountContainer />
      </section>
    </>
  )
}

AdminBillingComponent.propTypes = {
  organization: PropTypes.object,
}

export default AdminBillingComponent
