import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import useDocumentSocket from '../../hooks/useDocumentSocket'
import { currentUserId } from '../../libs/currentIds'

import { DOCUMENT_MODE, FIELD_TYPES } from 'Shared/constants'
import {
  DragIcon,
  ImageIcon,
  NumberIcon,
  RemoveIcon,
  SettingsIcon,
  StringIcon,
  TextIcon,
  TrashIcon
} from 'Components/Icons'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

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
  isUpdating,
  onDestroy,
  onRename,
  readOnly,
  settingsHandler,
  settingsMode,
}) => {
  const listRef = useRef()
  const nameRef = useRef()
  const { state: socketState } = useDocumentSocket()
  const { currentDocumentUserFieldFocus } = socketState

  const currentFieldUsers = Object.keys(currentDocumentUserFieldFocus).reduce((cur, userId) => {
    // user is focused on this field
    // TODO: probably want to filter out the current user as well
    if (currentDocumentUserFieldFocus[userId] === field.id) {
      return [...cur, userId]
    }
    return cur
  }, [])

  useEffect(() => {
    if (isNewField && nameRef.current) {
      nameRef.current.scrollIntoView({ behavior: 'smooth' })
      nameRef.current.focus()
    }
  }, [isNewField])

  const dataField = field.type !== FIELD_TYPES.TEXT && field.type !== FIELD_TYPES.IMAGE
  const documentEditMode = documentMode === DOCUMENT_MODE.EDIT

  const fieldClasses = cx({
    'document-field': true,
    'document-field--new': isNewField,
    'document-field--data': dataField,
    'document-field--text': field.type === FIELD_TYPES.TEXT,
    'document-field--number': field.type === FIELD_TYPES.NUMBER,
    'document-field--string': field.type === FIELD_TYPES.STRING,
    'document-field--image': field.type === FIELD_TYPES.IMAGE,
    'document-field--settings-mode': settingsMode,
    'document-field--edit-mode': documentEditMode,
  })

  const fieldToolClasses = cx({
    'document-field__tools': true,
    'document-field__tools--visible': documentEditMode,
  })

  const fieldActionClasses = cx({
    'document-field__actions': true,
    'document-field__actions--visible': documentEditMode,
  })

  const fieldContainerClasses = cx({
    'document-field__container': true,
    'document-field__container--edit-mode': documentEditMode,
  })

  const fieldLabels = {
    [FIELD_TYPES.TEXT]: 'Text area',
    [FIELD_TYPES.STRING]: 'String',
    [FIELD_TYPES.NUMBER]: 'Number',
    [FIELD_TYPES.IMAGE]: 'Image',
  }

  const fieldIcons = {
    [FIELD_TYPES.TEXT]: <TextIcon width="24" height="24" fill="var(--color-gray-40)" />,
    [FIELD_TYPES.STRING]: <StringIcon width="24" height="24" fill="var(--color-gray-40)" />,
    [FIELD_TYPES.NUMBER]: <NumberIcon width="24" height="24" fill="var(--color-gray-40)" />,
    [FIELD_TYPES.IMAGE]: <ImageIcon width="24" height="24" fill="var(--color-gray-40)" />,
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
      draggable={false}
      onDragEnd={dragEndHandler}
      onDragEnter={dragEnterHandler}
      onDragOver={e => e.preventDefault()}
      onDragStart={dragStartHandler}
      onDrop={dropHandler}
      ref={listRef}
    >
      <div className="document-field__component">

        <div className={fieldToolClasses}>
          {documentEditMode &&
          <div className="document-field__dragger">
            <button
              aria-label="Reorder field by dragging"
              className="btn btn--blank btn--with-circular-icon"
              onMouseDown={() => { listRef.current.setAttribute('draggable', true) }}
              onTouchStart={() => { listRef.current.setAttribute('draggable', true) }}
            >
              <DragIcon />
            </button>
          </div>
          }
        </div>

        <div className={fieldContainerClasses}>
          {documentEditMode &&
          <div className="document-field__outline">
            <div className="document-field__outline-icon">{fieldIcons[field.type]}</div>
            <div className="document-field__outline-name">
              <input
                defaultValue={field.name}
                maxLength={fieldNameMaxLength}
                onKeyDown={(e) => {
                  if (e.key.toLowerCase() === 'escape') {
                    e.target.blur()
                    return
                  }
                }}
                onChange={(e) => { onRename(field.id, e.target.value) }}
                type="text" />
            </div>
            <div className="document-field__outline-status">
              {isUpdating &&
              <SpinnerComponent />
              }
            </div>
          </div>
          }

          {dataField && !documentEditMode &&
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
          {documentEditMode &&
          <button aria-label="Remove field" className="btn btn--blank btn--red btn--with-circular-icon" onClick={onDestroy}>
            <TrashIcon fill="#ffffff" />
          </button>
          }
        </div>

        <h3>{currentFieldUsers}</h3>

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
  isUpdating: PropTypes.bool,
  onDestroy: PropTypes.func,
  onRename: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  settingsHandler: PropTypes.func.isRequired,
  settingsMode: PropTypes.bool.isRequired,
}

export default DocumentFieldComponent
