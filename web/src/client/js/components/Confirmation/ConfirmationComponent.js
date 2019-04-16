import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import './Confirmation.scss'

const ConfirmationComponent = ({ cancelAction, confirmedAction, confirmedLabel, message }) => {
  const confirmationRef = useRef()
  useClickOutside(confirmationRef, cancelAction)
  return (
    <div className="confirmation">
      <div className="confirmation__dialog" ref={confirmationRef}>
        <p className="confirmation__message">{message}</p>
        <div className="confirmation__actions">
          {cancelAction &&
          <button className="btn btn--white confirmation__cancel" onClick={cancelAction}>Cancel</button>
          }
          <button className="btn btn--white btn--danger confirmation__confirm" onClick={confirmedAction}>{confirmedLabel}</button>
        </div>
      </div>
    </div>
  )
}

ConfirmationComponent.propTypes = {
  cancelAction: PropTypes.func,
  confirmedAction: PropTypes.func.isRequired,
  confirmedLabel: PropTypes.string,
  message: PropTypes.element.isRequired
}

ConfirmationComponent.defaultProps = {
  confirmedLabel: 'Ok'
}

export default ConfirmationComponent
