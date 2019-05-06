import React from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'

const Checkbox = ({ help, id, label, large, name, placeholder, value, onChange }) => {
  const textFieldClasses = cx({
    'form-field': true,
    'form-field--horizontal': true,
    'form-field--checkbox': true,
    'form-field--large': large
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
  placeholder: PropTypes.string,
  value: PropTypes.bool,
  onChange: PropTypes.func
}

export default Checkbox
