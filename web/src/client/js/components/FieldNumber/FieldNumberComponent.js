import React from 'react'
import PropTypes from 'prop-types'

const FieldNumberComponent = ({ autoFocusElement, field, onChange, readOnly }) => {
  return (
    <input
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocusElement}
      className="document-field__number"
      defaultValue={field.value}
      onChange={(e) => { onChange(field.id, Number.parseFloat(e.target.value)) }}
      onFocus={(e) => {
        if (!readOnly) {
          e.target.select()
        }
      }}
      placeholder="A number value..."
      readOnly={readOnly}
      type="number" />
  )
}

FieldNumberComponent.propTypes = {
  autoFocusElement: PropTypes.bool,
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default FieldNumberComponent
