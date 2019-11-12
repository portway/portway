import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { PATH_USERS, PLAN_PRICING, SEATS_INCLUDED } from 'Shared/constants'
import Form from 'Components/Form/Form'
import FormField from 'Components/Form/FormField'

import './_AdminSeatsForm.scss'

const AdminSeatsForm = ({ cancelHandler, currentSeats, errors, formId, updateOrganizationSeats, includedSeats }) => {
  const [adjustedSeats, setAdjustedSeats] = useState(0)

  function formSubmitHandler() {
    updateOrganizationSeats(adjustedSeats)
  }

  function renderHelpText() {
    if (currentSeats >= includedSeats) {
      return (
        <>
          You currently have <b>{currentSeats}</b> active people in your organization.<br />
          To remove additional seats from your plan, you’ll need to <Link to={PATH_USERS}>remove some people</Link> first.
        </>
      )
    }
  }

  function getAdditionalSeatsCost() {
    if (adjustedSeats > 0) {
      return Number(adjustedSeats * PLAN_PRICING.SINGLE_USER)
    }
    return 0
  }

  return (
    <div className="admin-seats-form">
      <Form
        bigSubmit
        cancelHandler={cancelHandler}
        name={formId}
        onSubmit={formSubmitHandler}
        submitLabel="Update billing amount"
      >
        <FormField
          errors={errors.seats}
          help={renderHelpText()}
          id="admin-seats-form-number"
          label="Number of seats"
          min={0}
          name="seats"
          onChange={(e) => { setAdjustedSeats(e.target.value) }}
          defaultValue={currentSeats}
          placeholder={currentSeats}
          small
          type="number"
        />
      </Form>
      <div className="admin-seats-form__summary-container">
        <div className="admin-seats-form__summary">
          <h3 className="admin-seats-form__title">Plan change summary</h3>
          <ul className="admin-seats-form__summary-list">
            <li className="admin-seats-form__summary-item">
              Multi-user plan w/ {SEATS_INCLUDED} users <span className="admin-seats-form__summary-price">{PLAN_PRICING.MULTI_USER}</span>
            </li>
            <li className="admin-seats-form__summary-item">
              Additional seats: {adjustedSeats} <span className="admin-seats-form__summary-price">{getAdditionalSeatsCost()}</span>
            </li>
            <li className="admin-seats-form__summary-item admin-seats-form__summary-item--total">
              New total per month <span className="admin-seats-form__summary-total">{getAdditionalSeatsCost() + PLAN_PRICING.MULTI_USER}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

AdminSeatsForm.propTypes = {
  cancelHandler: PropTypes.func,
  currentSeats: PropTypes.number.isRequired,
  errors: PropTypes.object,
  formId: PropTypes.string.isRequired,
  updateOrganizationSeats: PropTypes.func.isRequired,
  includedSeats: PropTypes.number.isRequired,
}

export default AdminSeatsForm
