import React from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import DocumentFieldComponent from './DocumentFieldComponent'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'

const DocumentFieldsComponent = ({ fields, fieldChangeHandler, fieldDestroyHandler }) => {
  function renderFields() {
    const fieldArray = []
    fields.forEach((field) => {
      switch (field.type) {
        case Constants.FIELD_TYPES.TEXT: {
          fieldArray.push(
            <DocumentFieldComponent key={field.id} type={field.type} onDestroy={() => { fieldDestroyHandler(field.id) }}>
              <FieldTextComponent field={field} onChange={fieldChangeHandler} />
            </DocumentFieldComponent>
          )
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
