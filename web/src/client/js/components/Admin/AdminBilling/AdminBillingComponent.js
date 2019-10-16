import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { PLAN_TYPES } from 'Shared/constants'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import Form from 'Components/Form/Form'
import AdminSeatsContainer from 'Components/Admin/AdminSeats/AdminSeatsContainer'
import AdminPaymentContainer from 'Components/Admin/AdminPayment/AdminPaymentContainer'

import { CheckIcon } from 'Components/Icons'
import './_AdminBillingStyles.scss'

const AdminBillingComponent = ({ formId, organizationPlan, planChangeHandler }) => {
  const [plan, setPlan] = useState(organizationPlan)
  const [formChanged, setFormChanged] = useState(false)

  // @todo only adjust this title to what the server says we have plan wise
  const planTitle = plan === PLAN_TYPES.SINGLE_USER ? 'Single-user plan' : 'Multi-user plan'

  // Manually sets the Form's submit button to enabled, since we're not using
  // a normal form field
  function formChangeHandler(val) {
    setFormChanged(true)
    setPlan(val)
  }

  function formSubmitHandler() {
    setFormChanged(false)
    planChangeHandler(plan)
  }

  return (
    <>
      <section>
        <Form
          bigSubmit
          name={formId}
          onSubmit={formSubmitHandler}
          submitEnabled={formChanged}
          submitLabel="Update Plan"
        >
          <h2 id="rg1-label">Your plan: <span className="admin-plans__title">{planTitle}</span></h2>
          <ul className="admin-plans" role="radiogroup" aria-labelledby="rg1-label">
            <li className="admin-plans__item">
              <button
                aria-checked={plan === PLAN_TYPES.SINGLE_USER}
                aria-label="Select a single-user plan"
                className="btn btn--white"
                onClick={() => formChangeHandler(PLAN_TYPES.SINGLE_USER)}
                role="radio"
                type="button"
              >
                <div className="admin-plans__content">
                  <h3>Single-user</h3>
                  <div className="admin-plans__description">
                    <p>
                      Enjoy unlimited projects and documents all to yourself. This plan is perfect for
                      someone needing a notes app with a powerful API for querying.
                    </p>
                    <ul>
                      <li><CheckIcon fill="#51a37d" /> Unlimited projects</li>
                      <li><CheckIcon fill="#51a37d" /> Unlimited documents</li>
                      <li><CheckIcon fill="#51a37d" /> 10GB Storage</li>
                    </ul>
                  </div>
                </div>
                <span className="admin-plans__price">$10/mo {plan === PLAN_TYPES.SINGLE_USER && <>(Your plan)</>}</span>
              </button>
            </li>
            <li className="admin-plans__item">
              <button
                aria-checked={plan === PLAN_TYPES.MULTI_USER}
                aria-label="Select a multi-user plan"
                className="btn btn--white"
                onClick={() => formChangeHandler(PLAN_TYPES.MULTI_USER)}
                role="radio"
                type="button"
              >
                <div className="admin-plans__content">
                  <h3>Multi-user</h3>
                  <div className="admin-plans__description">
                    <p>
                      Create project teams, assign different roles, and manage organization wide
                      settings.
                    </p>
                    <ul>
                      <li><CheckIcon fill="#51a37d" /> Unlimited projects</li>
                      <li><CheckIcon fill="#51a37d" /> Unlimited documents</li>
                      <li><CheckIcon fill="#51a37d" /> Multiple teams and users (5 users included)</li>
                      <li><CheckIcon fill="#51a37d" /> Audit log</li>
                      <li><CheckIcon fill="#51a37d" /> 10GB Storage</li>
                    </ul>
                  </div>
                </div>
                <span className="admin-plans__price">$50/mo {plan === PLAN_TYPES.MULTI_USER && <>(Your plan)</>}</span>
              </button>
            </li>
          </ul>
        </Form>
      </section>
      <hr />
      <OrgPlanPermission acceptedPlans={[PLAN_TYPES.MULTI_USER]}>
        <section>
          <h2>Manage Seats</h2>
          <AdminSeatsContainer />
        </section>
        <hr />
      </OrgPlanPermission>
      <section>
        <h2>Payment information</h2>
        <AdminPaymentContainer />
      </section>
    </>
  )
}

AdminBillingComponent.propTypes = {
  formId: PropTypes.string,
  organizationPlan: PropTypes.string,
  planChangeHandler: PropTypes.func,
}

export default AdminBillingComponent
