import React from 'react'
import PropTypes from 'prop-types'

import './Validation.scss'

const ValidationComponent = ({ errors }) => {
  if (errors.length === 0) return null
  function renderErrors() {
    return errors.map((error, index) => {
      return <li key={index} className="validation__error-field"><span className="note">{error.message}</span></li>
    })
  }
  return (
    <div className="validation" role="alert">
      <ul className="validation__errors">
        {renderErrors()}
      </ul>
    </div>
  )
}

ValidationComponent.propTypes = {
  errors: PropTypes.array
}

ValidationComponent.defaultProps = {
  errors: []
}

export default ValidationComponent
