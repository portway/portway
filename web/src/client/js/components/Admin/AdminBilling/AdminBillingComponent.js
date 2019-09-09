import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { PLAN_TYPES } from 'Shared/constants'
import AdminSeatsContainer from 'Components/Admin/AdminSeats/AdminSeatsContainer'
import AdminPaymentContainer from 'Components/Admin/AdminPayment/AdminPaymentContainer'

import { CheckIcon } from 'Components/Icons'
import './_AdminBillingStyles.scss'

const AdminBillingComponent = ({ planChangeHandler }) => {
  const [plan, setPlan] = useState(PLAN_TYPES.SINGLE)
  const [formChanged, setFormChange] = useState(false)

  // Ref for each plan item
  const singleRef = useRef()
  const multiRef = useRef()

  // @todo only adjust this title to what the server says we have plan wise
  const planTitle = plan === PLAN_TYPES.SINGLE ? 'Single-user plan' : 'Multi-user plan'

  function formChangeHandler(e) {
    if (e.currentTarget === singleRef.current) {
      setPlan(PLAN_TYPES.SINGLE)
    } else {
      setPlan(PLAN_TYPES.MULTIPLE)
    }
    setFormChange(true)
  }

  function formSubmitHandler(e) {
    e.preventDefault()
    planChangeHandler(plan)
    return false
  }

  return (
    <>
      <section>
        <form onSubmit={formSubmitHandler}>
          <h2 id="rg1-label">Your plan: <span className="admin-plans__title">{planTitle}</span></h2>
          <ul className="admin-plans" role="radiogroup" aria-labelledby="rg1-label">
            <li className="admin-plans__item">
              <button type="button" className="btn" ref={singleRef} role="radio" aria-checked={plan === PLAN_TYPES.SINGLE} onClick={formChangeHandler}>
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
                <span className="admin-plans__price">$10/mo {plan === PLAN_TYPES.SINGLE && <>(Your plan)</>}</span>
              </button>
            </li>
            <li className="admin-plans__item">
              <button type="button" className="btn" ref={multiRef} role="radio" aria-checked={plan === PLAN_TYPES.MULTIPLE} onClick={formChangeHandler}>
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
                <span className="admin-plans__price">$50/mo {plan === PLAN_TYPES.MULTIPLE && <>(Your plan)</>}</span>
              </button>
            </li>
          </ul>
          <button className="admin-plans__submit" disabled={!formChanged}>Update plan</button>
        </form>
      </section>
      <hr />
      <section>
        <h2>Manage Seats</h2>
        <AdminSeatsContainer />
      </section>
      <hr />
      <section>
        <h2>Payment information</h2>
        <AdminPaymentContainer />
      </section>
    </>
  )
}

AdminBillingComponent.propTypes = {
  planChangeHandler: PropTypes.func,
}

export default AdminBillingComponent
