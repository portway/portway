import React from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'

const TextField = ({ help, id, label, large, name, placeholder, value, onChange }) => {
  const textFieldClasses = cx({
    'form-field': true,
    'form-field--large': large
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
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
}

export default TextField
