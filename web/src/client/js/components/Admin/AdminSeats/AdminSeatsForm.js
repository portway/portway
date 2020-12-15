import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { debounce } from 'Shared/utilities'
import { PATH_USERS } from 'Shared/constants'
import Form from 'Components/Form/Form'
import FormField from 'Components/Form/FormField'
import PopoverComponent from 'Components/Popover/PopoverComponent'

import { PLAN_TYPES } from 'Shared/constants'

import './_AdminSeatsForm.scss'

const AdminSeatsForm = ({
  additionalSeatCost,
  cancelHandler,
  errors,
  flatCost,
  formId,
  includedSeats,
  totalSeats,
  updateOrganizationSeats,
  usedSeats,
  plan,
}) => {
  const [newTotalSeats, setNewTotalSeats] = useState(totalSeats)
  const [validationError, setValidationError] = useState()

  function formSubmitHandler() {
    // Don't let the user set fewer seats than 5
    // or the number of users they have
    if (newTotalSeats < includedSeats) {
      setValidationError(`You can’t have fewer than ${includedSeats} seats.`)
      return false
    }
    if (newTotalSeats < usedSeats) {
      setValidationError(`You have ${usedSeats} used seats, please remove some people to decrease your seat count.`)
      return false
    }
    updateOrganizationSeats(newTotalSeats)
  }

  function renderHelpText() {
    if (newTotalSeats < usedSeats) {
      return (
        <>
          You currently have <b>{usedSeats}</b> active people in your organization.<br />
          To remove additional seats from your plan, you’ll need to <Link to={PATH_USERS}>remove some people</Link> first.
        </>
      )
    }
  }

  const setSeatValue = debounce(500, (value) => {
    setValidationError(null)
    setNewTotalSeats(value)
  })

  function getAdditionalSeatsCost() {
    // If we are changing seats and it's more than includedSeats (5)
    if (newTotalSeats > includedSeats) {
      return Number((newTotalSeats - includedSeats) * additionalSeatCost)
    }
    return (totalSeats - includedSeats) * additionalSeatCost
  }

  function getAdditionalSeatCount() {
    if (newTotalSeats > includedSeats) {
      return newTotalSeats - includedSeats
    }
    return totalSeats - includedSeats
  }

  return (
    <div className="admin-seats-form">
      <Form
        cancelHandler={cancelHandler}
        name={formId}
        onSubmit={formSubmitHandler}
        submitLabel="Update my plan"
      >
        <FormField
          errors={errors.seats}
          help={renderHelpText()}
          id="admin-seats-form-number"
          label="Number of seats"
          min={includedSeats}
          name="seats"
          onChange={e => setSeatValue(e.target.value)}
          defaultValue={totalSeats}
          placeholder={totalSeats}
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
              {plan === PLAN_TYPES.MULTI_USER ?
                <>Multi-user plan&nbsp;<b>w/ {includedSeats} users</b></>:
                <>Plan w/ 1 user</>}
              <span className="admin-seats-form__summary-price">{flatCost}</span> 
            </li>
            <li className="admin-seats-form__summary-item">
              Additional seats:&nbsp;<b>{getAdditionalSeatCount()}</b> <span className="admin-seats-form__summary-price">{getAdditionalSeatsCost()}</span>
            </li>
            <li className="admin-seats-form__summary-item admin-seats-form__summary-item--total">
              Total per month <span className="admin-seats-form__summary-total">{getAdditionalSeatsCost() + flatCost}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

AdminSeatsForm.propTypes = {
  additionalSeatCost: PropTypes.number.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  errors: PropTypes.object,
  flatCost: PropTypes.number.isRequired,
  formId: PropTypes.string.isRequired,
  includedSeats: PropTypes.number.isRequired,
  totalSeats: PropTypes.number.isRequired,
  updateOrganizationSeats: PropTypes.func.isRequired,
  usedSeats: PropTypes.number.isRequired,
}

export default AdminSeatsForm
