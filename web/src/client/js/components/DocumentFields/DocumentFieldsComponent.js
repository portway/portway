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
  disabled,
  documentMode,
  dragEndHandler,
  dragEnterHandler,
  dragLeaveHandler,
  dragStartHandler,
  dropHandler,
  fieldBlurHandler,
  fieldChangeHandler,
  fieldDestroyHandler,
  fieldFocusHandler,
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
        fieldTypeComponent = (
          <FieldTextComponent
            autoFocusElement={lastTextFieldId}
            field={field}
            onBlur={fieldBlurHandler}
            onChange={fieldChangeHandler}
            onFocus={fieldFocusHandler}
          />
        )
        break
      case Constants.FIELD_TYPES.NUMBER:
        fieldTypeComponent = (
          <FieldNumberComponent
            field={field}
            onBlur={fieldBlurHandler}
            onChange={fieldChangeHandler}
            onFocus={fieldFocusHandler}
          />
        )
        break
      case Constants.FIELD_TYPES.STRING:
        fieldTypeComponent = (
          <FieldStringComponent
            field={field}
            onBlur={fieldBlurHandler}
            onChange={fieldChangeHandler}
            onFocus={fieldFocusHandler}
          />
        )
        break
      case Constants.FIELD_TYPES.IMAGE:
        fieldTypeComponent = (
          <FieldImageComponent
            field={field}
            onBlur={fieldBlurHandler}
            onChange={fieldChangeHandler}
            onFocus={fieldFocusHandler}
            onRename={fieldRenameHandler}
            settingsHandler={(fieldId) => { toggleSettingsFor(fieldId) }}
            settingsMode={settingsForField === field.id}
            updating={fieldsUpdating[field.id]}
          />
        )
        break
      default:
        break
    }
    if (field) {
      const settingsModeForField = settingsForField === field.id
      return (
        <DocumentFieldComponent
          documentMode={documentMode}
          dragEndHandler={dragEndHandler}
          dragEnterHandler={settingsModeForField ? null : dragEnterHandler}
          dragLeaveHandler={settingsModeForField ? null : dragLeaveHandler}
          dragStartHandler={settingsModeForField ? null : dragStartHandler}
          dropHandler={settingsModeForField ? null : dropHandler}
          field={field}
          index={index}
          isNewField={createdFieldId === field.id}
          key={field.id}
          onDestroy={() => { fieldDestroyHandler(field.id) }}
          onRename={fieldRenameHandler}
          settingsHandler={(fieldId) => { toggleSettingsFor(fieldId) }}
          settingsMode={settingsModeForField}
        >
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
    'document__fields--disabled': isPublishing || disabled
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
  disabled: PropTypes.bool.isRequired,
  documentMode: PropTypes.string.isRequired,
  dragEndHandler: PropTypes.func.isRequired,
  dragEnterHandler: PropTypes.func.isRequired,
  dragLeaveHandler: PropTypes.func.isRequired,
  dragStartHandler: PropTypes.func.isRequired,
  dropHandler: PropTypes.func.isRequired,
  fieldBlurHandler: PropTypes.func.isRequired,
  fieldChangeHandler: PropTypes.func.isRequired,
  fieldDestroyHandler: PropTypes.func.isRequired,
  fieldFocusHandler: PropTypes.func.isRequired,
  fieldRenameHandler: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  fieldsUpdating: PropTypes.object.isRequired,
  isPublishing: PropTypes.bool.isRequired,
}

export default DocumentFieldsComponent
