import React from 'react'
import PropTypes from 'prop-types'

import { debounce } from 'Shared/utilities'
import './FieldNumber.scss'

const FieldNumberComponent = ({ field, onChange, showName }) => {
  // field name change
  const debouncedNameChangeHandler = debounce(1000, (body) => {
    onChange(field.id, body)
  })
  return (
    <>
    <input className="h-second-level" type="number" defaultValue={field.value} onChange={(e) => { onChange(field.id, e.target.value) }} />
    {showName &&
    <input className="field__name" type="text" defaultValue={field.name} onChange={(e) => {
      debouncedNameChangeHandler(field.id, { name: e.target.value })
    }} />
    }
    </>
  )
}

FieldNumberComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  showName: PropTypes.bool
}

export default FieldNumberComponent
