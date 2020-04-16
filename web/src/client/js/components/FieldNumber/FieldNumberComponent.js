import React from 'react'
import PropTypes from 'prop-types'
import { FIELD_TYPES } from 'Shared/constants'

const FieldNumberComponent = ({ id, type, value, onBlur, onChange, onFocus, readOnly }) => {
  const handleChange = (e) => {
    // API will only handle 15 significant digits for number fields
    if (e.target.value.length > 15) return
    const num = Number.parseFloat(e.target.value)
    if (!isNaN(num)) {
      onChange(id, num)
    }
    if (e.target.value === '') {
      onChange(id, null)
    }
  }

  return (
    <input
      className="document-field__number"
      value={value || ''}
      onBlur={(e) => { onBlur(id, type) }}
      onChange={(e) => {
        handleChange(e)
      }}
      onFocus={(e) => {
        if (!readOnly) {
          onFocus(id, type)
          e.target.select()
        }
      }}
      placeholder="A number value..."
      readOnly={readOnly}
      type="number" />
  )
}

FieldNumberComponent.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onFocus: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isCurrentlyFocusedField: PropTypes.bool,
  id: PropTypes.number,
  type: PropTypes.oneOf([FIELD_TYPES.NUMBER]),
  value: PropTypes.number
}

export default FieldNumberComponent
