import React from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'

const DocumentFieldsContainer = ({ fields }) => {
  function fieldChangeHandler(e) {
    console.log({ e })
  }
  function fieldDestroyHandler(e) {
    console.log('Destroy!')
    console.log({ e })
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

DocumentFieldsContainer.propTypes = {
  fields: PropTypes.array.isRequired
}

DocumentFieldsContainer.defaultProps = {
  fields: []
}

export default DocumentFieldsContainer
