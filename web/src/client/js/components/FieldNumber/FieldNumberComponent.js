import React from 'react'
import PropTypes from 'prop-types'
import { FIELD_TYPES } from 'Shared/constants'

const FieldNumberComponent = ({ autoFocusElement, id, type, value, onBlur, onChange, onFocus, readOnly, documentId }) => {
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
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocusElement}
      className="document-field__number"
      value={value || ''}
      onBlur={(e) => { onBlur(id, type, documentId) }}
      onChange={(e) => {
        handleChange(e)
      }}
      onFocus={(e) => {
        if (!readOnly) {
          onFocus(id, type, documentId)
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
  id: PropTypes.number,
  isCurrentlyFocusedField: PropTypes.bool,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onFocus: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  type: PropTypes.oneOf([FIELD_TYPES.NUMBER]),
  value: PropTypes.number,
  documentId: PropTypes.number.isRequired
}

export default FieldNumberComponent
