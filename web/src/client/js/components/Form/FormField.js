import React from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'
import ValidationComponent from 'Components/Validation/ValidationComponent'

// const TEXT_FIELD_TYPES = ['text', 'email', 'number']
const CHECKED_FIELD_TYPES = ['checkbox', 'radio']

const FormField = React.forwardRef(({
  checked,
  disabled,
  errors,
  help,
  id,
  label,
  large,
  name,
  status,
  small,
  type,
  value,
  ...props }, ref) => {
  const formFieldClasses = cx({
    'field-container': true,
    'field-container--large': large,
    'field-container--hidden': type === 'hidden',
  })
  const fieldClasses = cx({
    'field': true,
    'field--checkbox': type === 'checkbox',
    'field--radio': type === 'radio',
    'field--error': errors.length > 0,
    'field--file': type === 'file',
    'field--large': large,
    'field--small': small,
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
          {type !== 'textarea' &&
            <input
              defaultChecked={CHECKED_FIELD_TYPES.includes(type) ? checked : null}
              defaultValue={value}
              disabled={disabled}
              id={id}
              name={name}
              ref={ref}
              type={type}
              {...props}
            />
          }
          {type === 'textarea' &&
          <textarea defaultValue={value} id={id} name={name} ref={ref} {...props}></textarea>
          }
          {status &&
          <div className="field__status">{status}</div>
          }
        </div>
        <ValidationComponent errors={errors} />
      </div>
      {help && <div className="field-container__help small">{help}</div>}
    </div>
  )
})

FormField.propTypes = {
  checked: PropTypes.bool,
  errors: PropTypes.array,
  disabled: PropTypes.bool,
  help: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  hidden: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  large: PropTypes.bool,
  name: PropTypes.string.isRequired,
  status: PropTypes.node,
  small: PropTypes.bool,
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
