import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { PLAN_TYPES, ORG_SUBSCRIPTION_STATUS, MULTI_USER_PLAN_TYPES } from 'Shared/constants'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import AdminNoticesContainer from 'Components/Admin/AdminNotices/AdminNoticesContainer'
import AdminPlanSelectorContainer from 'Components/Admin/AdminPlanSelector/AdminPlanSelectorContainer'
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
      <section id="plans" className={`section--plans${sectionClasses}`}>
        <AdminPlanSelectorContainer />
      </section>
      <hr />
      <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES}>
        <section id="seats" className={sectionClasses}>
          <h2>Manage seats</h2>
          <AdminSeatsContainer />
        </section>
        <hr />
      </OrgPlanPermission>
      {/* null is a special case for seed org */}
      <OrgPlanPermission acceptedPlans={[null, PLAN_TYPES.SINGLE_USER, PLAN_TYPES.MULTI_USER]}>
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
