import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import useClickOutside from 'Hooks/useClickOutside'
import FormField from 'Components/Form/FormField'
import './_Confirmation.scss'

const ConfirmationComponent = ({
  cancelAction,
  confirmedAction,
  confirmedLabel,
  confirmedText,
  message,
  theme
}) => {
  const [typedMessage, setTypedMessage] = useState()
  const confirmationRef = useRef()
  useClickOutside(confirmationRef, cancelAction)

  // Close or confirm on keydown
  function keyEventHandler(e) {
    if (e.keyCode === 13) {
      confirmedAction()
    }
  }

  function confirmationTextMatch() {
    return typedMessage === confirmedText
  }

  useEffect(() => {
    window.addEventListener('keydown', keyEventHandler, false)
    return function cleanup() {
      window.removeEventListener('keydown', keyEventHandler, false)
    }
  })

  const confirmationClasses = cx({
    'confirmation': true,
    'confirmation--danger': theme === 'danger',
    'confirmation--success': theme === 'success',
  })

  const confirmationButtonClasses = cx({
    'btn': true,
    'btn--white': theme === 'danger',
    'btn--danger': theme === 'danger',
    'confirmation__confirm': true,
  })

  return (
    <div className={confirmationClasses} role="alert">
      <div className="confirmation__dialog" ref={confirmationRef}>
        <div className="confirmation__message">
          {message}
          {confirmedText &&
          <form className="confirmation__text">
            <FormField
              id="confirmed-text"
              label={<>Type “<i>{confirmedText}</i>” to continue</>}
              name="confirmed-text"
              onChange={(e) => { setTypedMessage(e.target.value) }}
              placeholder="Type to confirm..."
              required
            />
          </form>
          }
        </div>
        <div className="confirmation__actions">
          {cancelAction &&
          <button className="btn btn--white confirmation__cancel" onClick={cancelAction}>Cancel</button>
          }
          <button
            className={confirmationButtonClasses}
            disabled={confirmedText && !confirmationTextMatch()}
            onClick={confirmedAction}
          >
            {confirmedLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

ConfirmationComponent.propTypes = {
  cancelAction: PropTypes.func,
  confirmedAction: PropTypes.func.isRequired,
  confirmedLabel: PropTypes.string,
  confirmedText: PropTypes.string,
  message: PropTypes.element.isRequired,
  theme: PropTypes.string,
}

ConfirmationComponent.defaultProps = {
  confirmedLabel: 'Ok'
}

export default ConfirmationComponent
