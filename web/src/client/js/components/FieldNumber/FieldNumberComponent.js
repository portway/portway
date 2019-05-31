import React from 'react'
import PropTypes from 'prop-types'

import './FieldNumber.scss'

const FieldNumberComponent = ({ field, onChange }) => {
  return (
    <input
      className="h-second-level"
      defaultValue={field.value}
      onChange={(e) => { onChange(field.id, Number.parseFloat(e.target.value)) }}
      onFocus={(e) => { e.target.select() }}
      type="number" />
  )
}

FieldNumberComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default FieldNumberComponent
