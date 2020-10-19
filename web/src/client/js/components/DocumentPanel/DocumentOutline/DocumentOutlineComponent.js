import React from 'react'
import PropTypes from 'prop-types'

import DocumentOutlineItem from './DocumentOutlineItem'
import './_DocumentOutline.scss'

const DocumentOutlineComponent = ({
  dragEndHandler,
  dragEnterHandler,
  dragLeaveHandler,
  dragStartHandler,
  dropHandler,
  fields,
  fieldsUpdating,
  fieldDestroyHandler,
  fieldRenameHandler,
}) => {
  return (
    <div className="document-outline">
      <ol className="document-outline__list" onDrop={dropHandler}>
        {fields.map((field, index) => {
          return (
            <DocumentOutlineItem
              dragEndHandler={dragEndHandler}
              dragEnterHandler={dragEnterHandler}
              dragLeaveHandler={dragLeaveHandler}
              dragStartHandler={dragStartHandler}
              dropHandler={dropHandler}
              field={field}
              index={index}
              isUpdating={fieldsUpdating[field.id]}
              key={field.id}
              onDestroy={() => { fieldDestroyHandler(field.id, field.type) }}
              onRename={fieldRenameHandler}
            />
          )
        })}
      </ol>
    </div>
  )
}

DocumentOutlineComponent.propTypes = {
  dragEndHandler: PropTypes.func.isRequired,
  dragEnterHandler: PropTypes.func.isRequired,
  dragLeaveHandler: PropTypes.func.isRequired,
  dragStartHandler: PropTypes.func.isRequired,
  dropHandler: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  fieldsUpdating: PropTypes.object,
  fieldDestroyHandler: PropTypes.func.isRequired,
  fieldRenameHandler: PropTypes.func.isRequired,
}

export default DocumentOutlineComponent
