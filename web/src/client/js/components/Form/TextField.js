import React from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'
import ValidationComponent from 'Components/Validation/ValidationComponent'

const TextField = ({
  ariaDescribedBy,
  disabled,
  errors,
  help,
  id,
  label,
  large,
  name,
  onBlur,
  onChange,
  placeholder,
  required,
  status,
  type,
  value,
}) => {
  const textFieldClasses = cx({
    'form-field': true,
    'form-field--large': large,
    'form-field--error': errors.length > 0
  })
  const fieldClasses = cx({
    'field': true
  })
  const controlClasses = cx({
    'field__control': true,
    'field__control--with-status': status
  })
  return (
    <div className={textFieldClasses}>
      <div className={fieldClasses}>
        <label htmlFor={id}>{label}</label>
        <div className={controlClasses}>
          <input
            aria-describedby={ariaDescribedBy}
            aria-required={required}
            disabled={disabled}
            type={type}
            name={name}
            id={id}
            placeholder={placeholder}
            defaultValue={value}
            onBlur={onBlur}
            onChange={onChange}
            required={required} />
          {status &&
          <div className="field__status">{status}</div>
          }
        </div>
        <ValidationComponent errors={errors} />
      </div>
      {help && <div className="form-field__help small">{help}</div>}
    </div>
  )
}

TextField.propTypes = {
  ariaDescribedBy: PropTypes.string,
  errors: PropTypes.array,
  disabled: PropTypes.bool,
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  large: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  status: PropTypes.node,
  type: PropTypes.string,
  value: PropTypes.string,
}

TextField.defaultProps = {
  errors: [],
  type: 'text'
}

export default TextField
