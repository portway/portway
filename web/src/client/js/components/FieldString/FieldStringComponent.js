import React from 'react'
import PropTypes from 'prop-types'

const FieldStringComponent = ({ field, onChange }) => {
  return (
    <input
      className="document-field__string"
      defaultValue={field.value}
      onChange={(e) => { onChange(field.id, e.target.value) }}
      onFocus={(e) => { e.target.select() }}
      placeholder="A string value..."
      type="text" />
  )
}

FieldStringComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default FieldStringComponent
