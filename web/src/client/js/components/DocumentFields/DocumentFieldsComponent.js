import React from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import DocumentFieldComponent from './DocumentFieldComponent'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'
import FieldNumberComponent from 'Components/FieldNumber/FieldNumberComponent'
import FieldStringComponent from 'Components/FieldString/FieldStringComponent'

const DocumentFieldsComponent = ({ fields, fieldChangeHandler, fieldDestroyHandler }) => {
  function renderFields() {
    const fieldArray = []
    const showFieldName = fields.length > 1
    fields.forEach((field) => {
      switch (field.type) {
        case Constants.FIELD_TYPES.TEXT: {
          return fieldArray.push(
            <DocumentFieldComponent key={field.id} type={field.type} onDestroy={() => { fieldDestroyHandler(field.id) }}>
              <FieldTextComponent field={field} showName={showFieldName} onChange={fieldChangeHandler} />
            </DocumentFieldComponent>
          )
        }
        case Constants.FIELD_TYPES.NUMBER: {
          return fieldArray.push(
            <DocumentFieldComponent key={field.id} type={field.type} onDestroy={() => { fieldDestroyHandler(field.id) }}>
              <FieldNumberComponent field={field} showName={showFieldName} onChange={fieldChangeHandler} />
            </DocumentFieldComponent>
          )
        }
        case Constants.FIELD_TYPES.STRING: {
          return fieldArray.push(
            <DocumentFieldComponent key={field.id} type={field.type} onDestroy={() => { fieldDestroyHandler(field.id) }}>
              <FieldStringComponent field={field} showName={showFieldName} onChange={fieldChangeHandler} />
            </DocumentFieldComponent>
          )
        }
        default: {
          break
        }
      }
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
