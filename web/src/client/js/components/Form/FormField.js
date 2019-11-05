import React from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'
import ValidationComponent from 'Components/Validation/ValidationComponent'

// const TEXT_FIELD_TYPES = ['text', 'email', 'number']
const CHECKED_FIELD_TYPES = ['checkbox', 'radio']

const FormField = ({
  disabled,
  errors,
  help,
  id,
  label,
  large,
  name,
  status,
  type,
  value,
  ...props
}) => {
  const formFieldClasses = cx({
    'field-container': true,
  })
  const fieldClasses = cx({
    'field': true,
    'field--checkbox': type === 'checkbox',
    'field--error': errors.length > 0,
    'field--file': type === 'file',
    'field--large': large,
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
            defaultChecked={CHECKED_FIELD_TYPES.includes(type) ? value : null}
            defaultValue={value}
            disabled={disabled}
            id={id}
            name={name}
            type={type}
            {...props}
          />
          {status &&
          <div className="field__status">{status}</div>
          }
        </div>
        <ValidationComponent errors={errors} />
      </div>
      {help && <div className="field-container__help small">{help}</div>}
    </div>
  )
}

FormField.propTypes = {
  errors: PropTypes.array,
  disabled: PropTypes.bool,
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  large: PropTypes.bool,
  name: PropTypes.string.isRequired,
  status: PropTypes.node,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
}

FormField.defaultProps = {
  errors: [],
  type: 'text'
}

export default FormField
