import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Constants from 'Shared/constants'
import { DragIcon, TrashIcon } from 'Components/Icons'

import './_DocumentField.scss'

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

  const showName = field.type !== Constants.FIELD_TYPES.TEXT

  const fieldClasses = cx({
    'document-field': true,
    'document-field--new': isNewField,
    'document-field--text': field.type === Constants.FIELD_TYPES.TEXT,
    'document-field--number': field.type === Constants.FIELD_TYPES.NUMBER,
    'document-field--string': field.type === Constants.FIELD_TYPES.STRING,
  })

  const fieldLabels = {
    [Constants.FIELD_TYPES.TEXT]: 'Text area',
    [Constants.FIELD_TYPES.STRING]: 'String',
    [Constants.FIELD_TYPES.NUMBER]: 'Number',
  }

  // Field name handling
  const fieldLengthFactor = 6.5
  const fieldNameMaxLength = 50
  const fieldMinimumWidth = 150 // this is set as a var in _DocumentField.scss as well
  function returnInitialNameLength(length) {
    if (length > fieldNameMaxLength) {
      return
    }
    return length * fieldLengthFactor > fieldMinimumWidth ? length * fieldLengthFactor : fieldMinimumWidth
  }
  return (
    <li
      className={fieldClasses}
      data-id={field.id}
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
          <span className="document-field__name-label">{fieldLabels[field.type]}</span>
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
        <div className="document-field__content">{children}</div>
        <div className="document-field__tools">
          <div className="document-field__tool-options">
            {onDestroy &&
            <button className="btn btn--blank btn--with-circular-icon" onClick={onDestroy}>
              <TrashIcon />
            </button>
            }
            <div className="document-field__dragger">
              <DragIcon fill="#d9dbdb" />
            </div>
          </div>
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
