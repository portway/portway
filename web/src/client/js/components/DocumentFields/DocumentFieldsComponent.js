import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { FIELD_TYPES } from 'Shared/constants'
import DocumentFieldComponent from './DocumentFieldComponent'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'
import FieldNumberComponent from 'Components/FieldNumber/FieldNumberComponent'
import FieldStringComponent from 'Components/FieldString/FieldStringComponent'
import FieldImageComponent from 'Components/FieldImage/FieldImageComponent'
import FieldDateComponent from 'Components/FieldDate/FieldDateComponent'
import FieldFileComponent from 'Components/FieldFile/FieldFileComponent'

const DocumentFieldsComponent = React.forwardRef(({
  createdFieldId,
  createFieldHandler,
  disabled,
  fieldBlurHandler,
  fieldChangeHandler,
  fieldDiscardHandler,
  fieldFocusHandler,
  fieldRenameHandler,
  fields,
  fieldSettingsHandler,
  fieldsUpdating,
  isPublishing,
  readOnly
}, ref) => {
  const hasOnlyOneTextField = fields.length === 1 && fields[0].type === FIELD_TYPES.TEXT

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
    fieldSettingsHandler(fieldId)
  }

  function renderFieldType(field, index) {
    let fieldTypeComponent
    switch (field.type) {
      case FIELD_TYPES.TEXT:
        fieldTypeComponent = (
          <FieldTextComponent
            autoFocusElement={hasOnlyOneTextField || createdFieldId === field.id}
            onBlur={fieldBlurHandler}
            onFocus={fieldFocusHandler}
            readOnly={readOnly}
          />
        )
        break
      case FIELD_TYPES.NUMBER:
        fieldTypeComponent = (
          <FieldNumberComponent
            autoFocusElement={createdFieldId === field.id}
            onBlur={fieldBlurHandler}
            onFocus={fieldFocusHandler}
            readOnly={readOnly}
          />
        )
        break
      case FIELD_TYPES.STRING:
        fieldTypeComponent = (
          <FieldStringComponent
            autoFocusElement={createdFieldId === field.id}
            onBlur={fieldBlurHandler}
            onFocus={fieldFocusHandler}
            readOnly={readOnly}
          />
        )
        break
      case FIELD_TYPES.IMAGE:
        fieldTypeComponent = (
          <FieldImageComponent
            autoFocusElement={createdFieldId === field.id}
            field={field}
            onBlur={fieldBlurHandler}
            onFocus={fieldFocusHandler}
            onRename={fieldRenameHandler}
            onDiscard={fieldDiscardHandler}
            readOnly={readOnly}
            settingsHandler={(fieldId) => { toggleSettingsFor(fieldId) }}
            updating={fieldsUpdating[field.id]}
          />
        )
        break
      case FIELD_TYPES.DATE:
        fieldTypeComponent = (
          <FieldDateComponent
            autoFocusElement={createdFieldId === field.id}
            onBlur={fieldBlurHandler}
            onChange={fieldChangeHandler}
            onFocus={fieldFocusHandler}
            readOnly={readOnly}
          />
        )
        break
      case FIELD_TYPES.FILE:
        fieldTypeComponent = (
          <FieldFileComponent
            field={field}
            onBlur={fieldBlurHandler}
            onChange={fieldChangeHandler}
            onFocus={fieldFocusHandler}
            onRename={fieldRenameHandler}
            readOnly={readOnly}
            settingsHandler={(fieldId) => { toggleSettingsFor(fieldId) }}
            updating={fieldsUpdating[field.id]}
          />
        )
        break
      default:
        break
    }
    if (field) {
      return (
        <DocumentFieldComponent
          field={field}
          index={index}
          isNewField={createdFieldId === field.id}
          isUpdating={fieldsUpdating[field.id]}
          key={field.id}
          onBlur={fieldBlurHandler}
          onFocus={fieldFocusHandler}
          onChange={fieldChangeHandler}
          onRename={fieldRenameHandler}
          onDiscard={fieldDiscardHandler}
          readOnly={readOnly}
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
    'document__fields--disabled': isPublishing || disabled
  })
  return (
    <div ref={ref} className={fieldsClasses}>
      <ol className="document__fields-list">
        {renderFields()}
      </ol>
    </div>
  )
})

DocumentFieldsComponent.propTypes = {
  createdFieldId: PropTypes.number,
  createFieldHandler: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  fieldBlurHandler: PropTypes.func.isRequired,
  fieldChangeHandler: PropTypes.func.isRequired,
  fieldFocusHandler: PropTypes.func.isRequired,
  fieldRenameHandler: PropTypes.func.isRequired,
  fieldDiscardHandler: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  fieldSettingsHandler: PropTypes.func.isRequired,
  fieldsUpdating: PropTypes.object.isRequired,
  isPublishing: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired
}

export default DocumentFieldsComponent
