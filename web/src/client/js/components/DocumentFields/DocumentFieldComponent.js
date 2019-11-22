import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { DOCUMENT_MODE, FIELD_TYPES } from 'Shared/constants'
import { DragIcon, SettingsIcon, TrashIcon } from 'Components/Icons'

import './_DocumentField.scss'
import './_DocumentTools.scss'

const DocumentFieldComponent = ({
  children,
  documentMode,
  dragOverHandler,
  dragStartHandler,
  dropHandler,
  field,
  index,
  isNewField,
  onDestroy,
  onRename,
  settingsHandler,
  settingsMode,
}) => {
  const listRef = useRef()
  const nameRef = useRef()
  useEffect(() => {
    if (isNewField && nameRef.current) {
      nameRef.current.scrollIntoView({ behavior: 'smooth' })
      nameRef.current.focus()
    }
  }, [isNewField])

  const dataField = field.type !== FIELD_TYPES.TEXT && field.type !== FIELD_TYPES.IMAGE

  const fieldClasses = cx({
    'document-field': true,
    'document-field--new': isNewField,
    'document-field--edit-mode': documentMode === DOCUMENT_MODE.EDIT,
    'document-field--data': dataField,
    'document-field--text': field.type === FIELD_TYPES.TEXT,
    'document-field--number': field.type === FIELD_TYPES.NUMBER,
    'document-field--string': field.type === FIELD_TYPES.STRING,
    'document-field--image': field.type === FIELD_TYPES.IMAGE,
  })

  const fieldLabels = {
    [FIELD_TYPES.TEXT]: 'Text area',
    [FIELD_TYPES.STRING]: 'String',
    [FIELD_TYPES.NUMBER]: 'Number',
    [FIELD_TYPES.IMAGE]: 'Photo',
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
      onDragStart={dragStartHandler}
      onDragOver={dragOverHandler}
      onDrop={dropHandler}
      ref={listRef}
    >
      <div className="document-field__component">

        <div className="document-field__tools">
          {documentMode === DOCUMENT_MODE.EDIT &&
            <div className="document-field__dragger">
              <button aria-label="Reorder field by dragging" className="btn btn--blank btn--with-circular-icon" onMouseDown={() => { listRef.current.setAttribute('draggable', true) }}>
                <DragIcon />
              </button>
            </div>
          }
        </div>

        <div className="document-field__container">
          {dataField &&
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
          <div className="document-field__content">
            {field.type === FIELD_TYPES.IMAGE && field.value &&
            <button aria-label="Field settings" className="btn btn--blank btn--with-circular-icon" onClick={() => { settingsHandler(field.id) }}>
              <SettingsIcon />
            </button>
            }
            {children}
          </div>
        </div>

        <div className="document-field__actions">
          {documentMode === DOCUMENT_MODE.EDIT &&
          <button aria-label="Remove field" className="btn btn--blank btn--red btn--with-circular-icon" onClick={onDestroy}>
            <TrashIcon fill="#ffffff" />
          </button>
          }
        </div>

      </div>
    </li>
  )
}

DocumentFieldComponent.propTypes = {
  children: PropTypes.element.isRequired,
  documentMode: PropTypes.string.isRequired,
  dragOverHandler: PropTypes.func.isRequired,
  dragStartHandler: PropTypes.func.isRequired,
  dropHandler: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isNewField: PropTypes.bool.isRequired,
  onDestroy: PropTypes.func,
  onRename: PropTypes.func.isRequired,
  settingsHandler: PropTypes.func.isRequired,
  settingsMode: PropTypes.bool.isRequired,
}

export default DocumentFieldComponent
