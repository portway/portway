import React from 'react'
import PropTypes from 'prop-types'

const FieldTextComponent = ({ field }) => {
  return (
    <div className="field field--text">
      Field!
    </div>
  )
}

FieldTextComponent.propTypes = {
  field: PropTypes.object.isRequired
}

export default FieldTextComponent
