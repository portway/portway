import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import PortwayEditor from './portway/editor'
import './portway/styles.scss'

const FieldTextComponent = ({ autoFocusElement, field, onBlur, onChange, onFocus, readOnly }) => {
  const textRef = useRef()
  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const editor = new PortwayEditor(textRef.current)
  })
  return (
    <div className="document-field__text">
      <textarea ref={textRef} defaultValue={field.value} readOnly={readOnly} />
    </div>
  )
}

FieldTextComponent.propTypes = {
  autoFocusElement: PropTypes.number,
  field: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default FieldTextComponent
