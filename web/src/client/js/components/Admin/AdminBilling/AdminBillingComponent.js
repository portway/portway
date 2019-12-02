import React from 'react'
import PropTypes from 'prop-types'

import { LOCKED_ACCOUNT_STATUSES, PLAN_TYPES, ORG_SUBSCRIPTION_STATUS } from 'Shared/constants'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import AdminPlanSelectorContainer from 'Components/Admin/AdminPlanSelector/AdminPlanSelectorContainer'
import AdminSeatsContainer from 'Components/Admin/AdminSeats/AdminSeatsContainer'
import AdminPaymentContainer from 'Components/Admin/AdminPayment/AdminPaymentContainer'

import './_AdminBilling.scss'

const AdminBillingComponent = ({ organization }) => {
  return (
    <>
      <section id="plans">
        {(organization.subscriptionStatus === ORG_SUBSCRIPTION_STATUS.TRIALING || organization.subscriptionStatus === null) &&
        <div className="admin-billing__notice">
          <h2>Trial Period</h2>
          <p>During your trial, you are limited to a single-user plan.</p>
          <p>Add your payment information below to activate your account or to upgrade to a multi-user plan.</p>
        </div>
        }
        {LOCKED_ACCOUNT_STATUSES.includes(organization.subscriptionStatus) &&
        <div className="admin-billing__notice admin-billing__notice--danger">
          <h2>Past Due</h2>
          <p>We cannot successfully bill you with your current payment information.</p>
          <p>Please update your payment information below to activate your account.</p>
        </div>
        }
        <AdminPlanSelectorContainer />
      </section>
      <hr />
      <OrgPlanPermission acceptedPlans={[PLAN_TYPES.MULTI_USER]}>
        <section id="seats">
          <h2>Manage Seats</h2>
          <AdminSeatsContainer />
        </section>
        <hr />
      </OrgPlanPermission>
      <section id="payment">
        <h2>Payment information</h2>
        <AdminPaymentContainer />
      </section>
    </>
  )
}

AdminBillingComponent.propTypes = {
  organization: PropTypes.object
}

export default AdminBillingComponent
