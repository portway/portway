import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const FieldNumberComponent = ({ field, onBlur, onChange, onFocus, readOnly }) => {
  const [fieldValue, setFieldValue] = useState(field.value)

  useEffect(() => {
    setFieldValue(field.value)
  }, [field.value])

  return (
    <input
      className="document-field__number"
      value={fieldValue == null ? '' : fieldValue}
      onBlur={(e) => { onBlur(field.id, field.type, field) }}
      onChange={(e) => {
        const num = Number.parseFloat(e.target.value)
        if (!isNaN(num)) {
          setFieldValue(num)
          onChange(field.id, num)
        }
        if (e.target.value === '') {
          setFieldValue('')
          onChange(field.id, null)
        }
      }}
      onFocus={(e) => {
        if (!readOnly) {
          onFocus(field.id, field.type, field)
          e.target.select()
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
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default FieldNumberComponent
