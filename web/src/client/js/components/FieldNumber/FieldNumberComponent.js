import React from 'react'
import PropTypes from 'prop-types'

const FieldNumberComponent = ({ field, onChange, readOnly }) => {
  return (
    <input
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
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default FieldNumberComponent
