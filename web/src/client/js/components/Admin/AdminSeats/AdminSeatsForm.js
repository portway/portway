import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { PATH_USERS, PLAN_PRICING, SEATS_INCLUDED } from 'Shared/constants'
import Form from 'Components/Form/Form'
import FormField from 'Components/Form/FormField'
import PopoverComponent from 'Components/Popover/PopoverComponent'

import './_AdminSeatsForm.scss'

const AdminSeatsForm = ({ cancelHandler, currentSeats, errors, formId, updateOrganizationSeats, includedSeats }) => {
  const [newTotalSeats, setNewTotalSeats] = useState(includedSeats)
  const [validationError, setValidationError] = useState()

  function formSubmitHandler() {
    // Don't let the user set fewer seats than 5
    // or the number of users they have
    if (newTotalSeats < SEATS_INCLUDED) {
      setValidationError(`You can’t have fewer than ${SEATS_INCLUDED} seats`)
      return
    }
    updateOrganizationSeats(newTotalSeats)
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
    if (newTotalSeats > SEATS_INCLUDED) {
      return Number((newTotalSeats - SEATS_INCLUDED) * PLAN_PRICING.SINGLE_USER)
    }
    return 0
  }

  function getAdditionalSeatCount() {
    if (newTotalSeats > SEATS_INCLUDED) {
      return newTotalSeats - SEATS_INCLUDED
    }
    return currentSeats - SEATS_INCLUDED
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
          min={SEATS_INCLUDED}
          name="seats"
          onChange={(e) => { setNewTotalSeats(e.target.value) }}
          defaultValue={currentSeats}
          placeholder={currentSeats}
          small
          type="number"
        />
        {validationError &&
        <PopoverComponent name="seat-popover">
          {validationError}
        </PopoverComponent>
        }
      </Form>
      <div className="admin-seats-form__summary-container">
        <div className="admin-seats-form__summary">
          <h3 className="admin-seats-form__title">Plan change summary</h3>
          <ul className="admin-seats-form__summary-list">
            <li className="admin-seats-form__summary-item">
              Multi-user plan w/ {SEATS_INCLUDED} users <span className="admin-seats-form__summary-price">{PLAN_PRICING.MULTI_USER}</span>
            </li>
            <li className="admin-seats-form__summary-item">
              Additional seats: {getAdditionalSeatCount()} <span className="admin-seats-form__summary-price">{getAdditionalSeatsCost()}</span>
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
