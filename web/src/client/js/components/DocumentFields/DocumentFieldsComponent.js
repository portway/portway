import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { DOCUMENT_MODE, FIELD_TYPES } from 'Shared/constants'
import DocumentFieldComponent from './DocumentFieldComponent'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'
import FieldNumberComponent from 'Components/FieldNumber/FieldNumberComponent'
import FieldStringComponent from 'Components/FieldString/FieldStringComponent'
import FieldImageComponent from 'Components/FieldImage/FieldImageComponent'

const DocumentFieldsComponent = ({
  activeUsers,
  createdFieldId,
  createFieldHandler,
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
  isDragging,
  isPublishing,
  readOnly,
}) => {
  const [settingsForField, setSettingsForField] = useState(null)

  const textFields = fields.filter((field) => {
    return field.type === FIELD_TYPES.TEXT
  })
  const lastTextFieldId = textFields.length > 0 ? textFields[textFields.length - 1].id : null
  const documentEditMode = documentMode === DOCUMENT_MODE.EDIT

  const bigInvisibleButton = (
    <li className="document-field" key="bib">
      <button
        aria-label="Continue the document body"
        className="btn btn--blank document-field__invisible-button"
        onClick={createFieldHandler}
      />
    </li>
  )

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
      case FIELD_TYPES.TEXT:
        fieldTypeComponent = (
          <FieldTextComponent
            autoFocusElement={lastTextFieldId}
            field={field}
            onBlur={fieldBlurHandler}
            onChange={fieldChangeHandler}
            onFocus={fieldFocusHandler}
            editMode={documentEditMode}
            readOnly={readOnly}
          />
        )
        break
      case FIELD_TYPES.NUMBER:
        fieldTypeComponent = (
          <FieldNumberComponent
            field={field}
            onBlur={fieldBlurHandler}
            onChange={fieldChangeHandler}
            onFocus={fieldFocusHandler}
            editMode={documentEditMode}
            readOnly={readOnly}
          />
        )
        break
      case FIELD_TYPES.STRING:
        fieldTypeComponent = (
          <FieldStringComponent
            field={field}
            onBlur={fieldBlurHandler}
            onChange={fieldChangeHandler}
            onFocus={fieldFocusHandler}
            editMode={documentEditMode}
            readOnly={readOnly}
          />
        )
        break
      case FIELD_TYPES.IMAGE:
        fieldTypeComponent = (
          <FieldImageComponent
            field={field}
            onBlur={fieldBlurHandler}
            onChange={fieldChangeHandler}
            onFocus={fieldFocusHandler}
            onRename={fieldRenameHandler}
            editMode={documentEditMode}
            readOnly={readOnly}
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
          isDragging={isDragging}
          isNewField={createdFieldId === field.id}
          isUpdating={fieldsUpdating[field.id]}
          key={field.id}
          onDestroy={() => { fieldDestroyHandler(field.id, field.type) }}
          onRename={fieldRenameHandler}
          readOnly={readOnly}
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
      // If we're at the last field, and that field is NOT a text field
      if (
        index === fields.length - 1 &&
        field.type !== FIELD_TYPES.TEXT &&
        documentMode !== DOCUMENT_MODE.EDIT &&
        !readOnly
      ) {
        // append a big invisible button so that you can click there to continue the "body"
        fieldArray.push(bigInvisibleButton)
      }
    })
    return fieldArray
  }
  const fieldsClasses = cx({
    'document__fields': true,
    'document__fields--edit-mode': documentEditMode,
    'document__fields--is-dragging': isDragging,
    'document__fields--disabled': isPublishing || disabled
  })
  return (
    <div className={fieldsClasses}>
      <h1>{activeUsers}</h1>
      <ol>
        {renderFields()}
      </ol>
    </div>
  )
}

DocumentFieldsComponent.propTypes = {
  activeUsers: PropTypes.array,
  createdFieldId: PropTypes.number,
  createFieldHandler: PropTypes.func.isRequired,
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
  isDragging: PropTypes.bool.isRequired,
  isPublishing: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default DocumentFieldsComponent
