import React from 'react'
import PropTypes from 'prop-types'

const FieldErrors = ({ errors }) => {
  if (errors.length === 0) return null
  function renderErrors() {
    return errors.map((error, index) => {
      return <li key={index} className="form-field__error-field"><span className="note">{error.message}</span></li>
    })
  }
  return (
    <div className="form-field__errors" role="alert">
      <ul>
        {renderErrors()}
      </ul>
    </div>
  )
}

FieldErrors.propTypes = {
  errors: PropTypes.array
}

FieldErrors.defaultProps = {
  errors: []
}

export default FieldErrors
