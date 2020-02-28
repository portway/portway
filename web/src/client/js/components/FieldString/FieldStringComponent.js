import React from 'react'
import PropTypes from 'prop-types'

const FieldStringComponent = ({ field, onBlur, onChange, onFocus, readOnly }) => {
  return (
    <input
      className="document-field__string"
      defaultValue={field.value}
      onBlur={(e) => { onBlur(field.id, field.type, field) }}
      onChange={(e) => { onChange(field.id, e.target.value) }}
      onFocus={(e) => {
        if (!readOnly) {
          onFocus(field.id, field.type, field)
          e.target.select()
        }
      }}
      placeholder="A string value..."
      readOnly={readOnly}
      type="text" />
  )
}

FieldStringComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default FieldStringComponent
