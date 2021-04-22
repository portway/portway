import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { FIELD_TYPES } from 'Shared/constants'

const FieldStringComponent = ({
  autoFocusElement,
  id,
  type,
  value,
  documentId,
  onBlur,
  onChange,
  onFocus,
  readOnly
}) => {
  const focusRef = useRef()
  useEffect(() => {
    if (autoFocusElement && focusRef.current) {
      focusRef.current.focus()
    }
  }, [autoFocusElement])
  return (
    <input
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocusElement}
      className="document-field__string"
      value={value || ''}
      onBlur={(e) => { onBlur(id, type, documentId) }}
      onChange={(e) => {
        onChange(id, e.target.value)
      }}
      onFocus={(e) => {
        if (!readOnly) {
          onFocus(id, type, documentId)
          e.target.select()
        }
      }}
      placeholder="A string value..."
      readOnly={readOnly}
      ref={focusRef}
      type="text"
      maxLength="255" />
  )
}

FieldStringComponent.propTypes = {
  autoFocusElement: PropTypes.bool,
  id: PropTypes.number,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onFocus: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  type: PropTypes.oneOf([FIELD_TYPES.STRING]),
  value: PropTypes.string,
  documentId: PropTypes.number
}

export default FieldStringComponent
