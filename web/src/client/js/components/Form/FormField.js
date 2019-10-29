import React from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'
import ValidationComponent from 'Components/Validation/ValidationComponent'

// const TEXT_FIELD_TYPES = ['text', 'email', 'number']
const CHECKED_FIELD_TYPES = ['checkbox', 'radio']
const FILE_FIELD_TYPES = ['file']

const FormField = ({
  accept,
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
  const formFieldClasses = cx({
    'form-field': true,
    'form-field--large': large,
    'form-field--file': type === 'file',
    'form-field--checkbox': type === 'checkbox',
    'form-field--horizontal': type === 'checkbox',
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
    <div className={formFieldClasses}>
      <div className={fieldClasses}>
        <label htmlFor={id}>{label}</label>
        <div className={controlClasses}>
          <input
            accept={FILE_FIELD_TYPES.includes(type) ? accept : null}
            aria-describedby={ariaDescribedBy}
            aria-required={required}
            defaultChecked={CHECKED_FIELD_TYPES.includes(type) ? value : null}
            defaultValue={value}
            disabled={disabled}
            id={id}
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            type={type}
          />
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

FormField.propTypes = {
  accept: PropTypes.string,
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
  value: PropTypes.string || PropTypes.bool,
}

FormField.defaultProps = {
  errors: [],
  type: 'text'
}

export default FormField
