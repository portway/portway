import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

const FieldNumberComponent = ({ field, onBlur, onChange, onFocus, readOnly }) => {
  const [fieldValue, setFieldValue] = useState(field.value)

  const isEditingRef = useRef(false)

  useEffect(() => {
    if (!isEditingRef.current) {
      setFieldValue(field.value)
    }
  }, [field.value])

  const handleChange = (e) => {
    // API will only handle 15 significant digits for number fields
    if (e.target.value.length > 15) return
    const num = Number.parseFloat(e.target.value)
    if (!isNaN(num)) {
      setFieldValue(num)
      onChange(field.id, num)
    }
    if (e.target.value === '') {
      setFieldValue('')
      onChange(field.id, null)
    }
  }

  return (
    <input
      className="document-field__number"
      value={fieldValue == null ? '' : fieldValue}
      onBlur={(e) => { onBlur(field.id, field.type, field); isEditingRef.current = false; handleChange(e) }}
      onChange={handleChange}
      onFocus={(e) => {
        if (!readOnly) {
          onFocus(field.id, field.type, field)
          e.target.select()
          isEditingRef.current = true
        }
      }}
      placeholder="A number value..."
      readOnly={readOnly}
      type="number" />
  )
}

FieldNumberComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onFocus: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default FieldNumberComponent
