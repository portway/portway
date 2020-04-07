import React from 'react'
import PropTypes from 'prop-types'

const FieldStringComponent = ({ autoFocusElement, field, onChange, readOnly }) => {
  return (
    <input
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocusElement}
      className="document-field__string"
      defaultValue={field.value}
      onChange={(e) => { onChange(field.id, e.target.value) }}
      onFocus={(e) => {
        if (!readOnly) {
          e.target.select()
        }
      }}
      placeholder="A string value..."
      readOnly={readOnly}
      type="text" />
  )
}

FieldStringComponent.propTypes = {
  autoFocusElement: PropTypes.bool,
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default FieldStringComponent
