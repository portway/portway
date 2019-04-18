import React from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import DocumentFieldComponent from './DocumentFieldComponent'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'
import FieldNumberComponent from 'Components/FieldNumber/FieldNumberComponent'
import FieldStringComponent from 'Components/FieldString/FieldStringComponent'

const DocumentFieldsComponent = ({
  createdFieldId,
  dragStartHandler,
  dragEndHandler,
  dragEnterHandler,
  dragLeaveHandler,
  dragOverHandler,
  dropHandler,
  fields,
  fieldChangeHandler,
  fieldRenameHandler,
  fieldDestroyHandler
}) => {
  const showFieldName = fields.length > 1
  function renderFieldType(field, index) {
    let fieldTypeComponent
    switch (field.type) {
      case Constants.FIELD_TYPES.TEXT:
        fieldTypeComponent = <FieldTextComponent field={field} onChange={fieldChangeHandler} />
        break
      case Constants.FIELD_TYPES.NUMBER:
        fieldTypeComponent = <FieldNumberComponent field={field} onChange={fieldChangeHandler} />
        break
      case Constants.FIELD_TYPES.STRING:
        fieldTypeComponent = <FieldStringComponent field={field} onChange={fieldChangeHandler} />
        break
      default:
        break
    }
    return (
      <DocumentFieldComponent
        key={field.id}
        index={index}
        isNewField={createdFieldId === field.id}
        field={field}
        dragStartHandler={dragStartHandler}
        dragEndHandler={dragEndHandler}
        dragEnterHandler={dragEnterHandler}
        dragLeaveHandler={dragLeaveHandler}
        dragOverHandler={dragOverHandler}
        dropHandler={dropHandler}
        showName={showFieldName}
        onRename={fieldRenameHandler}
        onDestroy={() => { fieldDestroyHandler(field.id) }}>
        {fieldTypeComponent}
      </DocumentFieldComponent>
    )
  }
  function renderFields() {
    const fieldArray = []
    fields.forEach((field, index) => {
      fieldArray.push(renderFieldType(field, index))
    })
    return fieldArray
  }
  return (
    <ol className="document__fields">
      {renderFields()}
    </ol>
  )
}

DocumentFieldsComponent.propTypes = {
  createdFieldId: PropTypes.number,
  dragStartHandler: PropTypes.func.isRequired,
  dragEndHandler: PropTypes.func.isRequired,
  dragEnterHandler: PropTypes.func.isRequired,
  dragLeaveHandler: PropTypes.func.isRequired,
  dragOverHandler: PropTypes.func.isRequired,
  dropHandler: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  fieldChangeHandler: PropTypes.func.isRequired,
  fieldRenameHandler: PropTypes.func.isRequired,
  fieldDestroyHandler: PropTypes.func.isRequired
}

export default DocumentFieldsComponent
