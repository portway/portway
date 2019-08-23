import React from 'react'
import PropTypes from 'prop-types'

import './FieldImage.scss'

const FieldImageComponent = ({ field, onChange }) => {
  return (
    <input
      className="h-second-level"
      defaultValue={field.value}
      onChange={(e) => { onChange(field.id, e.target.value) }}
      onFocus={(e) => { e.target.select() }}
      placeholder="A number value..."
      type="image"
      alt="image field"/>
  )
}

FieldImageComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default FieldImageComponent
