import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { getBrowser } from 'Utilities/browserUtils'

import {
  FREE_PLAN_TYPES,
  LOCKED_ACCOUNT_STATUSES,
  ORG_SUBSCRIPTION_STATUS,
  PLAN_LIMITS,
  PLAN_TITLES,
  PLAN_TYPES,
  SUPPORT_EMAIL,
  TRIALING_STATUSES,
} from 'Shared/constants'
import { CheckIcon } from 'Components/Icons'
import Form from 'Components/Form/Form'

import './_AdminPlanSelector.scss'

const AdminPlanSelectorComponent = ({
  formId, organizationPlan, organizationSubscriptionStatus, planChangeHandler
}) => {
  const [plan, setPlan] = useState(organizationPlan)
  const [formChanged, setFormChanged] = useState(false)

  const green = getComputedStyle(document.documentElement).getPropertyValue('--color-green')

  const planTitle = PLAN_TITLES[organizationPlan] || PLAN_TITLES[PLAN_TYPES.SINGLE_USER]
  const hasFreePlan = FREE_PLAN_TYPES.includes(organizationPlan)

  // Manually sets the Form's submit button to enabled, since we're not using
  // a normal form field
  function formChangeHandler(val) {
    if (val !== plan) {
      setFormChanged(true)
      setPlan(val)
    }
  }

  function formSubmitHandler() {
    setFormChanged(false)
    planChangeHandler(plan)
  }

  const lockedSubscription = LOCKED_ACCOUNT_STATUSES.includes(organizationSubscriptionStatus) ||
                             TRIALING_STATUSES.includes(organizationSubscriptionStatus) ||
                             organizationSubscriptionStatus === ORG_SUBSCRIPTION_STATUS.PENDING_CANCEL

  const adminPlanClasses = cx({
    'admin-plans-selector': true,
    'admin-plans-selector--disabled': lockedSubscription
  })

  const isSafari13 = getBrowser().name === 'Safari' && Number(getBrowser().version) < 14
  const adminPriceClasses = cx({
    'admin-plans-selector__price': true,
    'admin-plans-selector__price--safari-fix': isSafari13
  })

  return (
    <div className={adminPlanClasses}>
      {/* <h2 id="rg1-label">
        Your plan: <span className="admin-plans-selector__title">{planTitle}</span>
      </h2> */}
      {organizationPlan === PLAN_TYPES.MULTI_USER && (
        <p className="small">
        At the moment we cannot downgrade <span className="lowercase">{PLAN_TITLES[PLAN_TYPES.MULTI_USER]}s</span>.
        Please <a href={`mailto:${SUPPORT_EMAIL}`}>contact us</a> if you need assistance.
        </p>
      )}
      {hasFreePlan &&
        <p className="small">
          You are currently on a {planTitle} ❤️. If you would like to upgrade, please&nbsp;
          <a href={`mailto:${SUPPORT_EMAIL}`}>contact us</a>.
        </p>
      }
      {organizationPlan === PLAN_TYPES.SINGLE_USER &&
        <Form
          name={formId}
          onSubmit={formSubmitHandler}
          disabled={!formChanged}
          submitLabel="Update Plan">
          <ul className="admin-plans-selector__list" role="radiogroup" aria-labelledby="rg1-label">
            <li className="admin-plans-selector__item">
              <button
                aria-checked={plan === PLAN_TYPES.SINGLE_USER && !lockedSubscription}
                aria-label="Select a single-user plan"
                className="btn btn--white"
                disabled={organizationPlan === PLAN_TYPES.MULTI_USER}
                onClick={() => formChangeHandler(PLAN_TYPES.SINGLE_USER)}
                role="radio"
                type="button">
                <div className="admin-plans-selector__content">
                  <h3>{PLAN_TITLES[PLAN_TYPES.SINGLE_USER]}</h3>
                  <div className="admin-plans-selector__description">
                    <p>
                    Enjoy unlimited projects and documents all to yourself. This plan is perfect
                    for someone needing a writing app with a powerful API for querying.
                    </p>
                    <ul>
                      <li>
                        <CheckIcon fill={green} /> Unlimited projects
                      </li>
                      <li>
                        <CheckIcon fill={green} /> Unlimited documents
                      </li>
                      <li>
                        <CheckIcon fill={green} /> Full API access with multiple access levels
                      </li>
                      <li>
                        <CheckIcon fill={green} /> {PLAN_LIMITS[PLAN_TYPES.SINGLE_USER].storage}GB Storage
                      </li>
                    </ul>
                  </div>
                </div>
                <span className="admin-plans-selector__price">
                $10/mo {organizationPlan === PLAN_TYPES.SINGLE_USER && <>(Your plan)</>}
                </span>
              </button>
            </li>
            <li className="admin-plans-selector__item">
              <button
                aria-checked={plan === PLAN_TYPES.MULTI_USER && !lockedSubscription}
                aria-label="Select a team plan"
                className="btn btn--white"
                onClick={() => formChangeHandler(PLAN_TYPES.MULTI_USER)}
                role="radio"
                type="button">
                <div className="admin-plans-selector__content">
                  <h3>{PLAN_TITLES[PLAN_TYPES.MULTI_USER]}</h3>
                  <div className="admin-plans-selector__description">
                    <p>
                    Create project teams, assign different roles, and manage organization wide
                    settings.
                    </p>
                    <ul>
                      <li>
                        <CheckIcon fill={green} /> Unlimited projects
                      </li>
                      <li>
                        <CheckIcon fill={green} /> Unlimited documents
                      </li>
                      <li>
                        <CheckIcon fill={green} /> Full API access with multiple access levels
                      </li>
                      <li>
                        <CheckIcon fill={green} /> Multiple teams and users (5 users included)
                      </li>
                      <li>
                        <CheckIcon fill={green} /> Project access control. Select who can view, contribute, or administer projects
                      </li>
                      <li>
                        <CheckIcon fill={green} /> {PLAN_LIMITS[PLAN_TYPES.MULTI_USER].storage}GB Storage
                      </li>
                    </ul>
                  </div>
                </div>
                <span className={adminPriceClasses}>
                $50/mo {organizationPlan === PLAN_TYPES.MULTI_USER && <>(Your plan)</>}
                </span>
              </button>
            </li>
          </ul>
        </Form>
      }
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
