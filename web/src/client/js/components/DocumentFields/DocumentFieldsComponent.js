import React from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'

const DocumentFieldsComponent = ({ fields, fieldChangeHandler, fieldDestroyHandler }) => {
  function renderFields() {
    const fieldArray = []
    fields.forEach((field) => {
      switch (field.type) {
        case Constants.FIELD_TYPES.TEXT: {
          fieldArray.push(<FieldTextComponent key={field.id} field={field} onChange={fieldChangeHandler} onDestroy={fieldDestroyHandler} />)
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
