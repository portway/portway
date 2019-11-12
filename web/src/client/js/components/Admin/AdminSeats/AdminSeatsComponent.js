import React, { useState } from 'react'
import PropTypes from 'prop-types'

import AdminSeatsForm from './AdminSeatsForm'
import './_AdminSeatsStyles.scss'

const AdminSeatsComponent = ({ currentSeats, errors, formId, updateOrganizationSeats, includedSeats }) => {
  const [manageMode, setManageMode] = useState(false)
  return (
    <div className="admin-seats">
      {!manageMode &&
        <div className="admin-seats__status">
          <span className="admin-seats__status__label">
            <b>{currentSeats}</b> out of <b>{includedSeats}</b> Seats
          </span>
          <meter
            className="admin-seats__status__meter"
            high={includedSeats / 1.05}
            low={includedSeats * .5}
            max={includedSeats}
            min="1"
            optimum={includedSeats}
            value={currentSeats}
          >
            {currentSeats}/{includedSeats}
          </meter>
          <button className="btn btn--small" onClick={() => { setManageMode(true) }}>
            Change the number of seats
          </button>
        </div>
      }
      {manageMode &&
        <AdminSeatsForm
          cancelHandler={() => { setManageMode(false) }}
          currentSeats={currentSeats}
          errors={errors}
          formId={formId}
          updateOrganizationSeats={updateOrganizationSeats}
          includedSeats={includedSeats}
        />
      }
    </div>
  )
}

AdminSeatsComponent.propTypes = {
  currentSeats: PropTypes.number,
  errors: PropTypes.object,
  formId: PropTypes.string,
  updateOrganizationSeats: PropTypes.func,
  includedSeats: PropTypes.number,
}

export default AdminSeatsComponent
