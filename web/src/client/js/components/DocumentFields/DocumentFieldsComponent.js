import React from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import DocumentFieldComponent from './DocumentFieldComponent'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'
import FieldNumberComponent from 'Components/FieldNumber/FieldNumberComponent'
import FieldStringComponent from 'Components/FieldString/FieldStringComponent'

const DocumentFieldsComponent = ({ fields, fieldChangeHandler, fieldDestroyHandler }) => {
  const showFieldName = fields.length > 1
  function renderFieldType(field) {
    let fieldTypeComponent
    switch (field.type) {
      case Constants.FIELD_TYPES.TEXT:
        fieldTypeComponent = <FieldTextComponent field={field} showName={showFieldName} onChange={fieldChangeHandler} />
        break
      case Constants.FIELD_TYPES.NUMBER:
        fieldTypeComponent = <FieldNumberComponent field={field} showName={showFieldName} onChange={fieldChangeHandler} />
        break
      case Constants.FIELD_TYPES.STRING:
        fieldTypeComponent = <FieldStringComponent field={field} showName={showFieldName} onChange={fieldChangeHandler} />
        break
      default:
        break
    }
    return (
      <DocumentFieldComponent key={field.id} type={field.type} onDestroy={() => { fieldDestroyHandler(field.id) }}>{fieldTypeComponent}</DocumentFieldComponent>
    )
  }
  function renderFields() {
    const fieldArray = []
    fields.forEach((field) => {
      fieldArray.push(renderFieldType(field))
    })
    return fieldArray
  }
  return (
    <div className="document__fields">
      {renderFields()}
    </div>
  )
}

DocumentFieldsComponent.propTypes = {
  fields: PropTypes.array.isRequired,
  fieldChangeHandler: PropTypes.func.isRequired,
  fieldDestroyHandler: PropTypes.func.isRequired
}

export default DocumentFieldsComponent
