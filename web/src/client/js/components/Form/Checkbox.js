import React from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'
import ValidationComponent from 'Components/Validation/ValidationComponent'

const Checkbox = ({ help, id, label, large, name, errors, placeholder, value, onChange }) => {
  const textFieldClasses = cx({
    'form-field': true,
    'form-field--horizontal': true,
    'form-field--checkbox': true,
    'form-field--large': large,
    'form-field--error': errors.length > 0
  })
  return (
    <div className={textFieldClasses}>
      <div className="field">
        <label htmlFor={id}>{label}</label>
        <input
          type="checkbox"
          name={name}
          id={id}
          placeholder={placeholder}
          defaultChecked={value}
          onChange={onChange} />
        <ValidationComponent errors={errors} />
      </div>
      {help && <div className="form-field__help small">{help}</div>}
    </div>
  )
}

Checkbox.propTypes = {
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  large: PropTypes.bool,
  name: PropTypes.string.isRequired,
  errors: PropTypes.array,
  placeholder: PropTypes.string,
  value: PropTypes.bool,
  onChange: PropTypes.func
}

Checkbox.defaultProps = {
  errors: []
}

export default Checkbox
