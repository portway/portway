import React from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'

const DocumentFieldsComponent = ({ fields }) => {
  function fieldChangeHandler() {
  }
  function fieldDestroyHandler() {
  }
  const fieldMap = fields.map((field) => {
    switch (field.type) {
      case Constants.FIELD_TYPES.STRING: {
        return <span key={field.id}>String!</span>
      }
      case Constants.FIELD_TYPES.TEXT: {
        return <FieldTextComponent key={field.id} field={field} onChange={fieldChangeHandler} onDestroy={fieldDestroyHandler} />
      }
      case Constants.FIELD_TYPES.NUMBER: {
        return <span key={field.id}>Number!</span>
      }
    }
  })
  return (
    <div className="document-fields">
      {fieldMap}
    </div>
  )
}

DocumentFieldsComponent.propTypes = {
  fields: PropTypes.array.isRequired
}

DocumentFieldsComponent.defaultProps = {
  fields: []
}

export default DocumentFieldsComponent
