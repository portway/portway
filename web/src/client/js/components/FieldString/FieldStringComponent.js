import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

const FieldStringComponent = ({ field, onBlur, onChange, onFocus, readOnly }) => {
  const [fieldValue, setFieldValue] = useState(field.value)

  const isEditingRef = useRef(false)

  useEffect(() => {
    if (!isEditingRef.current) {
      setFieldValue(field.value)
    }
  }, [field.value])

  return (
    <input
      className="document-field__string"
      value={fieldValue || ''}
      onBlur={(e) => { onBlur(field.id, field.type, field); isEditingRef.current = false; onChange(field.id, e.target.value) }}
      onChange={(e) => { setFieldValue(e.target.value); onChange(field.id, e.target.value) }}
      onFocus={(e) => {
        if (!readOnly) {
          onFocus(field.id, field.type, field)
          e.target.select()
          isEditingRef.current = true
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
