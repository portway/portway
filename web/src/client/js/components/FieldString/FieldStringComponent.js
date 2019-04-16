import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { debounce } from 'Shared/utilities'
import './FieldString.scss'

const FieldStringComponent = ({ field, onChange }) => {
  // Value change
  const valueRef = useRef()
  const debouncedValueChangeHandler = debounce(1000, () => {
    onChange(field.id, { value: valueRef.current.value })
  })
  return (
    <input
      className="string h-second-level"
      defaultValue={field.value}
      onChange={debouncedValueChangeHandler}
      onFocus={(e) => { e.target.select() }}
      type="text"
      ref={valueRef} />
  )
}

FieldStringComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default FieldStringComponent
