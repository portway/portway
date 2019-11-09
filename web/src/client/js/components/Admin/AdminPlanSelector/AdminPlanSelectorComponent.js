import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { LOCKED_ACCOUNT_STATUSES, PLAN_TYPES, SUBSCRIPTION_STATUS } from 'Shared/constants'
import { CheckIcon } from 'Components/Icons'
import Form from 'Components/Form/Form'

import './_AdminPlanSelector.scss'

const AdminPlanSelectorComponent = ({
  formId, organizationPlan, organizationSubscriptionStatus, planChangeHandler
}) => {
  const [plan, setPlan] = useState(organizationPlan)
  const [formChanged, setFormChanged] = useState(false)

  const planTitle = organizationPlan === PLAN_TYPES.SINGLE_USER ? 'Single-user plan' : 'Multi-user plan'

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

  const lockedSubscription = LOCKED_ACCOUNT_STATUSES.includes(organizationSubscriptionStatus) ||
                             organizationSubscriptionStatus === SUBSCRIPTION_STATUS.TRIALING ||
                             organizationSubscriptionStatus === null

  const adminPlanClasses = cx({
    'admin-plans-selector': true,
    'admin-plans-selector--disabled': lockedSubscription
  })

  return (
    <div className={adminPlanClasses}>
      <h2 id="rg1-label">Your plan: <span className="admin-plans-selector__title">{planTitle}</span></h2>
      <Form
        bigSubmit
        name={formId}
        onSubmit={formSubmitHandler}
        submitEnabled={formChanged}
        submitLabel="Update Plan"
      >
        <ul className="admin-plans-selector__list" role="radiogroup" aria-labelledby="rg1-label">
          <li className="admin-plans-selector__item">
            <button
              aria-checked={plan === PLAN_TYPES.SINGLE_USER && !lockedSubscription}
              aria-label="Select a single-user plan"
              className="btn btn--white"
              disabled={organizationPlan === PLAN_TYPES.MULTI_USER}
              onClick={() => formChangeHandler(PLAN_TYPES.SINGLE_USER)}
              role="radio"
              type="button"
            >
              <div className="admin-plans-selector__content">
                <h3>Single-user</h3>
                <div className="admin-plans-selector__description">
                  <p>
                    Enjoy unlimited projects and documents all to yourself. This plan is perfect for
                    someone needing a notes app with a powerful API for querying.
                  </p>
                  <ul>
                    <li><CheckIcon fill="#6ACA65" /> Unlimited projects</li>
                    <li><CheckIcon fill="#6ACA65" /> Unlimited documents</li>
                    <li><CheckIcon fill="#6ACA65" /> 10GB Storage</li>
                  </ul>
                </div>
              </div>
              <span className="admin-plans-selector__price">$10/mo {organizationPlan === PLAN_TYPES.SINGLE_USER && <>(Your plan)</>}</span>
            </button>
          </li>
          <li className="admin-plans-selector__item">
            <button
              aria-checked={plan === PLAN_TYPES.MULTI_USER && !lockedSubscription}
              aria-label="Select a multi-user plan"
              className="btn btn--white"
              onClick={() => formChangeHandler(PLAN_TYPES.MULTI_USER)}
              role="radio"
              type="button"
            >
              <div className="admin-plans-selector__content">
                <h3>Multi-user</h3>
                <div className="admin-plans-selector__description">
                  <p>
                    Create project teams, assign different roles, and manage organization wide
                    settings.
                  </p>
                  <ul>
                    <li><CheckIcon fill="#6ACA65" /> Unlimited projects</li>
                    <li><CheckIcon fill="#6ACA65" /> Unlimited documents</li>
                    <li><CheckIcon fill="#6ACA65" /> Multiple teams and users (5 users included)</li>
                    <li><CheckIcon fill="#6ACA65" /> Audit log</li>
                    <li><CheckIcon fill="#6ACA65" /> 10GB Storage</li>
                  </ul>
                </div>
              </div>
              <span className="admin-plans-selector__price">$50/mo {organizationPlan === PLAN_TYPES.MULTI_USER && <>(Your plan)</>}</span>
            </button>
          </li>
        </ul>
        {organizationPlan === PLAN_TYPES.MULTI_USER &&
        <p className="small">At the moment we cannot downgrade multi-user plans. Please contact us if you need assistance.</p>
        }
      </Form>
    </div>
  )
}

AdminPlanSelectorComponent.propTypes = {
  formId: PropTypes.string,
  organizationPlan: PropTypes.string || null,
  organizationSubscriptionStatus: PropTypes.string || null,
  planChangeHandler: PropTypes.func,
}

export default AdminPlanSelectorComponent
