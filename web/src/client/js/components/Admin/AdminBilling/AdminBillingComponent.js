import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { LOCKED_ACCOUNT_STATUSES, PLAN_TYPES, ORG_SUBSCRIPTION_STATUS } from 'Shared/constants'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import AdminPlanSelectorContainer from 'Components/Admin/AdminPlanSelector/AdminPlanSelectorContainer'
import AdminSeatsContainer from 'Components/Admin/AdminSeats/AdminSeatsContainer'
import AdminPaymentContainer from 'Components/Admin/AdminPayment/AdminPaymentContainer'

import './_AdminBilling.scss'

const AdminBillingComponent = ({ deleteAccountHander, orgBilling, organization }) => {
  return (
    <>
      <section id="plans">
        {(organization.subscriptionStatus === ORG_SUBSCRIPTION_STATUS.TRIALING || organization.subscriptionStatus === null) &&
        <div className="admin-billing__notice">
          <h2>Trial period</h2>
          <p>During your trial, you are limited to a single-user plan.</p>
          <p>Add your payment information below to activate your account or to upgrade to a multi-user plan.</p>
        </div>
        }
        {LOCKED_ACCOUNT_STATUSES.includes(organization.subscriptionStatus) &&
        <div className="admin-billing__notice admin-billing__notice--danger">
          <h2>Past due</h2>
          <p>We cannot successfully bill you with your current payment information.</p>
          <p>Please update your payment information below to activate your account.</p>
        </div>
        }
        {organization.subscriptionStatus === ORG_SUBSCRIPTION_STATUS.PENDING_CANCEL && orgBilling &&
        <div className="admin-billing__notice">
          <h2 className="danger">Account canceled</h2>
          <p>Your current period ends <b>{moment.unix(orgBilling.subscription.cancelAt).format('MMMM Do, YYYY')}</b>. You have access to your projects and documents until then.</p>
        </div>
        }
        <AdminPlanSelectorContainer />
      </section>
      <hr />
      <OrgPlanPermission acceptedPlans={[PLAN_TYPES.MULTI_USER]}>
        <section id="seats">
          <h2>Manage seats</h2>
          <AdminSeatsContainer />
        </section>
        <hr />
      </OrgPlanPermission>
      <section id="payment">
        <h2>Payment information</h2>
        <AdminPaymentContainer />
      </section>
      {organization.subscriptionStatus !== ORG_SUBSCRIPTION_STATUS.PENDING_CANCEL &&
      <>
      <hr />
      <section id="cancel">
        <h2 className="danger">Cancel account</h2>
        <p>Cancel your Portway account, and remove all data.</p>
        <button className="btn btn--white btn--danger" onClick={deleteAccountHander}>Delete my account</button>
      </section>
      </>
      }
    </>
  )
}

AdminBillingComponent.propTypes = {
  deleteAccountHander: PropTypes.func.isRequired,
  orgBilling: PropTypes.object,
  organization: PropTypes.object,
}

export default AdminBillingComponent
