import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { DOCUMENT_MODE, FIELD_TYPES } from 'Shared/constants'
import { DragIcon, RemoveIcon, SettingsIcon, TrashIcon } from 'Components/Icons'

import './_DocumentField.scss'
import './_DocumentFieldSettings.scss'
import './_DocumentTools.scss'

const DocumentFieldComponent = ({
  children,
  documentMode,
  dragEndHandler,
  dragEnterHandler,
  dragLeaveHandler,
  dragStartHandler,
  dropHandler,
  field,
  index,
  isNewField,
  onDestroy,
  onRename,
  readOnly,
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
    'document-field--settings-mode': settingsMode,
  })

  const fieldToolClasses = cx({
    'document-field__tools': true,
    'document-field__tools--visible': documentMode === DOCUMENT_MODE.EDIT,
  })

  const fieldActionClasses = cx({
    'document-field__actions': true,
    'document-field__actions--visible': documentMode === DOCUMENT_MODE.EDIT,
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

  const dragEnabled = !readOnly && documentMode === DOCUMENT_MODE.EDIT

  return (
    <li
      className={fieldClasses}
      data-id={field.id}
      data-order={index}
      onDragEnd={dragEnabled ? null : dragEndHandler}
      onDragEnter={dragEnabled ? null : dragEnterHandler}
      onDragOver={e => e.preventDefault()}
      onDragStart={dragEnabled ? null : dragStartHandler}
      onDrop={dragEnabled ? null : dropHandler}
      ref={listRef}
    >
      <div className="document-field__component">

        <div className={fieldToolClasses}>
          {!readOnly &&
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
              onFocus={(e) => {
                if (!readOnly) {
                  e.target.select()
                }
              }}
              readOnly={readOnly}
              ref={nameRef}
              style={{ width: returnInitialNameLength(field.name.length) + 'px' }}
              type="text" />
          </div>
          }
          <div className="document-field__content">
            <div className="document-field__settings-button">
              <>
              {field.type === FIELD_TYPES.IMAGE && field.value && !settingsMode && !readOnly &&
                <button aria-label="Field settings" className="btn btn--blank btn--with-circular-icon" onClick={() => { settingsHandler(field.id) }}>
                  <SettingsIcon />
                </button>
              }
              {settingsMode && !readOnly &&
                <button aria-label="Exit settings" className="btn btn--blank btn--with-circular-icon" onClick={() => { settingsHandler(field.id) }}>
                  <RemoveIcon width="32" height="32" />
                </button>
              }
              </>
            </div>
            {children}
          </div>
        </div>

        <div className={fieldActionClasses}>
          {!readOnly &&
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
  dragEndHandler: PropTypes.func,
  dragEnterHandler: PropTypes.func,
  dragLeaveHandler: PropTypes.func,
  dragStartHandler: PropTypes.func,
  dropHandler: PropTypes.func,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isNewField: PropTypes.bool.isRequired,
  onDestroy: PropTypes.func,
  onRename: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  settingsHandler: PropTypes.func.isRequired,
  settingsMode: PropTypes.bool.isRequired,
}

export default DocumentFieldComponent
