import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import AdminSeatsForm from './AdminSeatsForm'
import './_AdminSeatsStyles.scss'

const AdminSeatsComponent = ({
  additionalSeatCost,
  errors,
  flatCost,
  formId,
  includedSeats,
  totalSeats,
  updateOrganizationSeats,
  usedSeats,
  plan
}) => {
  const [manageMode, setManageMode] = useState(false)
  useEffect(() => {
    // Get out of managed mode if totalSeats changes
    setManageMode(false)
  }, [totalSeats])
  return (
    <div className="admin-seats">
      {!manageMode &&
        <div className="admin-seats__status">
          <span className="admin-seats__status__label">
            <b>{usedSeats}</b> out of <b>{totalSeats}</b> Seats
          </span>
          <meter
            className="admin-seats__status__meter"
            high={totalSeats / 1.05}
            low={totalSeats > 1 ? totalSeats * .5 : 1}
            max={totalSeats}
            min="0"
            optimum={totalSeats}
            value={usedSeats}
          >
            {usedSeats}/{totalSeats}
          </meter>
          <button className="btn btn--like-a-link" onClick={() => { setManageMode(true) }}>
            Change the number of seats
          </button>
        </div>
      }
      {manageMode &&
        <AdminSeatsForm
          additionalSeatCost={additionalSeatCost}
          cancelHandler={() => { setManageMode(false) }}
          errors={errors}
          flatCost={flatCost}
          formId={formId}
          includedSeats={includedSeats}
          totalSeats={totalSeats}
          updateOrganizationSeats={updateOrganizationSeats}
          usedSeats={usedSeats}
          plan={plan}
        />
      }
    </div>
  )
}

AdminSeatsComponent.propTypes = {
  additionalSeatCost: PropTypes.number,
  errors: PropTypes.object,
  flatCost: PropTypes.number,
  formId: PropTypes.string,
  includedSeats: PropTypes.number,
  plan: PropTypes.string,
  totalSeats: PropTypes.number,
  updateOrganizationSeats: PropTypes.func,
  usedSeats: PropTypes.number,
}

export default AdminSeatsComponent
