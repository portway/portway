import React from 'react'
import PropTypes from 'prop-types'

const FieldNumberComponent = ({ field, onChange }) => {
  return (
    <input
      className="document-field__number"
      defaultValue={field.value}
      onChange={(e) => { onChange(field.id, Number.parseFloat(e.target.value)) }}
      onFocus={(e) => { e.target.select() }}
      placeholder="A number value..."
      type="number" />
  )
}

FieldNumberComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default FieldNumberComponent
