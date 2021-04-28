import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { FIELD_TYPES } from 'Shared/constants'

const STRING_MAX_LENGTH = 255

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
  const [counterVisible, setCounterVisible] = useState(false)
  const focusRef = useRef()

  useEffect(() => {
    if (autoFocusElement && focusRef.current) {
      focusRef.current.focus()
    }
  }, [autoFocusElement])

  useEffect(() => {
    let interval = null
    if (counterVisible) {
      interval = setInterval(() => {
        setCounterVisible(false)
      }, 5000)
    }
    return () => { clearInterval(interval) }
  }, [counterVisible])

  return (
    <>
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocusElement}
        className="document-field__string"
        value={value || ''}
        onBlur={(e) => { onBlur(id, type, documentId) }}
        onChange={(e) => {
          setCounterVisible(true)
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
        maxLength={STRING_MAX_LENGTH} />
      <span className="document-field__string-status">
        {counterVisible &&
        <>
        {focusRef.current && focusRef.current.value.length} / {STRING_MAX_LENGTH}
        </>
        }
      </span>
    </>
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
