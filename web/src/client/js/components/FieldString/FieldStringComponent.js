import React from 'react'
import PropTypes from 'prop-types'
import { FIELD_TYPES } from 'Shared/constants'

const FieldStringComponent = ({ id, type, value, onBlur, onChange, onFocus, readOnly }) => {
  return (
    <input
      className="document-field__string"
      value={value || ''}
      onBlur={(e) => { onBlur(id, type) }}
      onChange={(e) => {
        onChange(id, e.target.value)
      }}
      onFocus={(e) => {
        if (!readOnly) {
          onFocus(id, type)
          e.target.select()
        }
      }}
      placeholder="A string value..."
      readOnly={readOnly}
      type="text" />
  )
}

FieldStringComponent.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onFocus: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  id: PropTypes.number,
  type: PropTypes.oneOf([FIELD_TYPES.STRING]),
  value: PropTypes.string
}

export default FieldStringComponent
