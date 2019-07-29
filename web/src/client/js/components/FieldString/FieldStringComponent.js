import React from 'react'
import PropTypes from 'prop-types'

import './FieldString.scss'

const FieldStringComponent = ({ field, onChange }) => {
  return (
    <input
      className="string h-second-level"
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
