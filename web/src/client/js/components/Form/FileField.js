import React from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'
import ValidationComponent from 'Components/Validation/ValidationComponent'

const FileField = ({ help, id, label, large, name, errors, value, onChange }) => {
  const fileFieldClasses = cx({
    'form-field': true,
    'form-field--file': true,
    'form-field--large': large,
    'form-field--error': errors.length > 0
  })
  return (
    <div className={fileFieldClasses}>
      <div className="field">
        {label && <label htmlFor={id}>{label}</label>}
        <input
          type="file"
          name={name}
          id={id}
          defaultValue={value}
          onChange={onChange} />
        <ValidationComponent errors={errors} />
      </div>
      {help && <div className="form-field__help small">{help}</div>}
    </div>
  )
}

FileField.propTypes = {
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  large: PropTypes.bool,
  name: PropTypes.string.isRequired,
  errors: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func
}

FileField.defaultProps = {
  errors: [],
}

export default FileField
