import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

const FieldStringComponent = ({ field, onBlur, onChange, onFocus, readOnly, isCurrentlyFocusedField }) => {
  const [fieldValue, setFieldValue] = useState(field.value)

  const isCurrentlyFocusedFieldRef = useRef(isCurrentlyFocusedField)
  isCurrentlyFocusedFieldRef.current = isCurrentlyFocusedField

  useEffect(() => {
    if (!isCurrentlyFocusedFieldRef.current) {
      setFieldValue(field.value)
    }
  }, [field.value])

  return (
    <input
      className="document-field__string"
      value={fieldValue || ''}
      onBlur={(e) => { onBlur(field.id, field.type, field) }}
      onChange={(e) => {
        if (isCurrentlyFocusedField) {
          setFieldValue(e.target.value); onChange(field.id, e.target.value)
        }
      }}
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
  onChange: PropTypes.func,
  onFocus: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isCurrentlyFocusedField: PropTypes.bool
}

export default FieldStringComponent
