import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { FIELD_TYPES } from 'Shared/constants'
import {
  DragIcon,
  ImageIcon,
  NumberIcon,
  RemoveIcon,
  StringIcon,
  TextIcon,
} from 'Components/Icons'
import { IconButton } from 'Components/Buttons'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

const DocumentOutlineItem = ({
  dragEndHandler,
  dragEnterHandler,
  dragLeaveHandler,
  dragStartHandler,
  dropHandler,
  field,
  index,
  isUpdating,
  onDestroy,
  onRename
}) => {
  const [dragEnabled, setDragEnabled] = useState(true)
  const listItemRef = useRef()
  const fieldIcons = {
    [FIELD_TYPES.TEXT]: <TextIcon width="24" height="24" fill="var(--theme-icon-color)" />,
    [FIELD_TYPES.STRING]: <StringIcon width="24" height="24" fill="var(--theme-icon-color)" />,
    [FIELD_TYPES.NUMBER]: <NumberIcon width="24" height="24" fill="var(--theme-icon-color)" />,
    [FIELD_TYPES.IMAGE]: <ImageIcon width="24" height="24" fill="var(--theme-icon-color)" />,
  }

  function focusDocumentFieldHandler(e) {
    if (listItemRef.current) {
      const docEl = document.querySelector('.document')
      const documentField = docEl.querySelector(`.document-field[data-id="${listItemRef.current.dataset.id}"]`)
      documentField.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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
          onBlur={enableDragHandler}
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
          type="text" />
      </div>
      <div className="document-outline__status">
        {isUpdating &&
        <SpinnerComponent />
        }
      </div>
      <div className="document-outline__actions">
        <IconButton color="red" onClick={onDestroy}>
          <RemoveIcon fill="var(--theme-surface)" width="14" height="14" />
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
  index: PropTypes.number.isRequired,
  isUpdating: PropTypes.bool,
  onDestroy: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
}

export default DocumentOutlineItem
