import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Constants from 'Shared/constants'
import { TrashIcon } from 'Components/Icons'

import './DocumentField.scss'

const DocumentFieldComponent = ({
  children,
  dragStartHandler,
  dragEndHandler,
  dragEnterHandler,
  dragLeaveHandler,
  dragOverHandler,
  dropHandler,
  field,
  index,
  isNewField,
  showName,
  onDestroy,
  onRename
}) => {
  const nameRef = useRef()
  useEffect(() => {
    if (isNewField && nameRef.current) {
      nameRef.current.scrollIntoView({ behavior: 'smooth' })
      nameRef.current.focus()
    }
  }, [isNewField])

  const fieldClasses = cx({
    'document-field': true,
    'document-field--new': isNewField,
    'document-field--text': field.type === Constants.FIELD_TYPES.TEXT,
    'document-field--number': field.type === Constants.FIELD_TYPES.NUMBER,
    'document-field--string': field.type === Constants.FIELD_TYPES.STRING,
  })

  // Field name handling
  const fieldLengthFactor = 6.5
  const fieldNameMaxLength = 50
  const fieldMinimumWidth = 100
  function returnInitialNameLength(length) {
    if (length > fieldNameMaxLength) {
      return
    }
    return length * fieldLengthFactor > fieldMinimumWidth ? length * fieldLengthFactor : fieldMinimumWidth
  }
  return (
    <li
      className={fieldClasses}
      data-order={index}
      draggable="true"
      onDragStart={dragStartHandler}
      onDragEnd={dragEndHandler}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragOverHandler}
      onDrop={dropHandler}>
      <div className="document-field__component">
        {showName &&
        <div className="document-field__name">
          <input
            defaultValue={field.name}
            maxLength={fieldNameMaxLength}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() === 'escape') {
                e.target.blur()
                return
              }
              e.target.style.width = `${returnInitialNameLength(e.target.value.length + 1)}px`
            }}
            onChange={(e) => { onRename(field.id, e.target.value) }}
            onFocus={(e) => { e.target.select() }}
            ref={nameRef}
            style={{ width: returnInitialNameLength(field.name.length) + 'px' }}
            type="text" />
        </div>
        }
        {children}
      </div>
      <div className="document-field__tools">
        <div className="document-field__tool-options">
          {onDestroy &&
          <button className="btn btn--blank btn--with-circular-icon" onClick={onDestroy}>
            <TrashIcon width="18" height="18" />
          </button>
          }
        </div>
      </div>
    </li>
  )
}

DocumentFieldComponent.propTypes = {
  children: PropTypes.element.isRequired,
  dragStartHandler: PropTypes.func.isRequired,
  dragEndHandler: PropTypes.func.isRequired,
  dragEnterHandler: PropTypes.func.isRequired,
  dragLeaveHandler: PropTypes.func.isRequired,
  dragOverHandler: PropTypes.func.isRequired,
  dropHandler: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isNewField: PropTypes.bool.isRequired,
  showName: PropTypes.bool.isRequired,
  onDestroy: PropTypes.func,
  onRename: PropTypes.func.isRequired
}

export default DocumentFieldComponent
