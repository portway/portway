import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { FIELD_TYPES } from 'Shared/constants'
import {
  DateIcon,
  DragIcon,
  FileIcon,
  ImageIcon,
  NumberIcon,
  SettingsIcon,
  StringIcon,
  TextIcon,
  TrashIcon,
} from 'Components/Icons'
import { IconButton } from 'Components/Buttons'
import { getFileExtension } from 'Utilities/fileUtilities'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

const DocumentOutlineItem = ({
  dragEndHandler,
  dragEnterHandler,
  dragLeaveHandler,
  dragStartHandler,
  dropHandler,
  field,
  fieldSettingToggleHandler,
  index,
  isUpdating,
  onDestroy,
  onRename
}) => {
  const [dragEnabled, setDragEnabled] = useState(true)
  const listItemRef = useRef()
  const documentFieldRef = useRef()
  const nameRef = useRef()

  const fieldsWithSettings = [
    FIELD_TYPES.IMAGE
  ]

  const fileExtension = field.meta ? getFileExtension(field.meta.originalName) : null
  const fieldIcons = {
    [FIELD_TYPES.TEXT]: <TextIcon width="24" height="24" />,
    [FIELD_TYPES.STRING]: <StringIcon width="24" height="24" />,
    [FIELD_TYPES.NUMBER]: <NumberIcon width="24" height="24" />,
    [FIELD_TYPES.IMAGE]: <ImageIcon width="24" height="24" />,
    [FIELD_TYPES.DATE]: <DateIcon width="24" height="24" />,
    [FIELD_TYPES.FILE]: <FileIcon width="24" height="24" extension={fileExtension} />,
  }

  if (nameRef.current && nameRef.current.value !== field.name && !isUpdating) {
    // we've had a name change come through, update the un-controlled name value
    nameRef.current.value = field.name
  }

  function focusDocumentFieldHandler(e) {
    if (listItemRef.current) {
      const docEl = document.querySelector('.document')
      documentFieldRef.current = docEl.querySelector(`.document-field[data-id="${listItemRef.current.dataset.id}"]`)
      documentFieldRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      documentFieldRef.current.classList.add('highlight')
    }
  }

  function blurHandler(e) {
    e.stopPropagation()
    documentFieldRef.current.classList.remove('highlight')
    documentFieldRef.current = null
    setDragEnabled(true)
  }

  function disableDragHandler(e) {
    e.stopPropagation()
    setDragEnabled(false)
  }

  function enableDragHandler(e) {
    e.stopPropagation()
    setDragEnabled(true)
  }

  return (
    <li
      className="document-outline__list-item"
      data-id={field.id}
      data-order={index}
      draggable={dragEnabled}
      onDragEnd={(e) => { dragEnabled ? dragEndHandler(e) : e.preventDefault() }}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragStart={(e) => { dragEnabled ? dragStartHandler(e) : e.preventDefault() }}
      onDrop={dropHandler}
      ref={listItemRef}
    >
      <div className="document-outline__dragger"><DragIcon fill="var(--color-gray-30)" /></div>
      <div className="document-outline__icon">
        <IconButton color="transparent" square={true} onClick={focusDocumentFieldHandler}>
          {fieldIcons[field.type]}
        </IconButton>
      </div>
      <div className="document-outline__name">
        <input
          defaultValue={field.name}
          onBlur={blurHandler}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'escape') {
              e.target.blur()
              return
            }
          }}
          onFocus={focusDocumentFieldHandler}
          onMouseDown={disableDragHandler}
          onMouseUp={enableDragHandler}
          onChange={(e) => { onRename(field.id, e.target.value) }}
          type="text"
          ref={nameRef}/>
      </div>
      <div className="document-outline__status">
        {isUpdating &&
        <SpinnerComponent />
        }
      </div>
      <div className="document-outline__actions">
        {fieldsWithSettings.includes(field.type) &&
        <IconButton color="transparent" onClick={fieldSettingToggleHandler}>
          <SettingsIcon width="14" height="14" />
        </IconButton>
        }
        <IconButton color="transparent" onClick={onDestroy}>
          <TrashIcon width="14" height="14" />
        </IconButton>
      </div>
    </li>
  )
}

DocumentOutlineItem.propTypes = {
  dragEndHandler: PropTypes.func.isRequired,
  dragEnterHandler: PropTypes.func.isRequired,
  dragLeaveHandler: PropTypes.func.isRequired,
  dragStartHandler: PropTypes.func.isRequired,
  dropHandler: PropTypes.func.isRequired,
  field: PropTypes.object.isRequired,
  fieldSettingToggleHandler: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isUpdating: PropTypes.bool,
  onDestroy: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
}

export default DocumentOutlineItem
