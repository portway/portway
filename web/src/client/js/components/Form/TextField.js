import React from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'
import ValidationComponent from 'Components/Validation/ValidationComponent'

const TextField = ({ help, id, label, large, name, errors, placeholder, value, onChange }) => {
  const textFieldClasses = cx({
    'form-field': true,
    'form-field--large': large,
    'form-field--error': errors.length > 0
  })
  return (
    <div className={textFieldClasses}>
      <div className="field">
        <label htmlFor={id}>{label}</label>
        <input
          type="text"
          name={name}
          id={id}
          placeholder={placeholder}
          defaultValue={value}
          onChange={onChange} />
        <ValidationComponent errors={errors} />
      </div>
      {help && <div className="form-field__help small">{help}</div>}
    </div>
  )
}

TextField.propTypes = {
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  large: PropTypes.bool,
  name: PropTypes.string.isRequired,
  errors: PropTypes.array,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
}

TextField.defaultProps = {
  errors: []
}

export default TextField
