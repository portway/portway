import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Constants from 'Shared/constants'
import DocumentFieldComponent from './DocumentFieldComponent'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'
import FieldNumberComponent from 'Components/FieldNumber/FieldNumberComponent'
import FieldStringComponent from 'Components/FieldString/FieldStringComponent'
import FieldImageComponent from 'Components/FieldImage/FieldImageComponent'

const DocumentFieldsComponent = ({
  createdFieldId,
  dragStartHandler,
  dragEndHandler,
  dragEnterHandler,
  dragLeaveHandler,
  dragOverHandler,
  dropHandler,
  fieldChangeHandler,
  fieldDestroyHandler,
  fieldRenameHandler,
  fields,
  fieldsUpdating,
  isPublishing,
}) => {
  const [settingsForField, setSettingsForField] = useState(null)

  const textFields = fields.filter((field) => {
    return field.type === Constants.FIELD_TYPES.TEXT
  })
  const lastTextFieldId = textFields.length > 0 ? textFields[textFields.length - 1].id : null

  function toggleSettingsFor(fieldId) {
    if (settingsForField === fieldId) {
      setSettingsForField(null)
      return
    }
    setSettingsForField(fieldId)
  }

  function renderFieldType(field, index) {
    let fieldTypeComponent
    switch (field.type) {
      case Constants.FIELD_TYPES.TEXT:
        fieldTypeComponent = <FieldTextComponent field={field} onChange={fieldChangeHandler} autoFocusElement={lastTextFieldId} />
        break
      case Constants.FIELD_TYPES.NUMBER:
        fieldTypeComponent = <FieldNumberComponent field={field} onChange={fieldChangeHandler} />
        break
      case Constants.FIELD_TYPES.STRING:
        fieldTypeComponent = <FieldStringComponent field={field} onChange={fieldChangeHandler} />
        break
      case Constants.FIELD_TYPES.IMAGE:
        fieldTypeComponent =
          <FieldImageComponent
            field={field}
            onChange={fieldChangeHandler}
            settingsHandler={(fieldId) => { toggleSettingsFor(fieldId) }}
            settingsMode={settingsForField === field.id}
            updating={fieldsUpdating[field.id]} />
        break
      default:
        break
    }
    if (field) {
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
          onRename={fieldRenameHandler}
          onDestroy={() => { fieldDestroyHandler(field.id) }}
          settingsHandler={(fieldId) => { toggleSettingsFor(fieldId) }}
          settingsMode={settingsForField === field.id}>
          {fieldTypeComponent}
        </DocumentFieldComponent>
      )
    }
  }
  function renderFields() {
    const fieldArray = []
    fields.forEach((field, index) => {
      fieldArray.push(renderFieldType(field, index))
    })
    return fieldArray
  }
  const fieldsClasses = cx({
    'document__fields': true,
    'document__fields--disabled': isPublishing
  })
  return (
    <div className={fieldsClasses}>
      <ol>
        {renderFields()}
      </ol>
    </div>
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
  fieldDestroyHandler: PropTypes.func.isRequired,
  isPublishing: PropTypes.bool.isRequired,
  fieldsUpdating: PropTypes.object.isRequired,
}

export default DocumentFieldsComponent
