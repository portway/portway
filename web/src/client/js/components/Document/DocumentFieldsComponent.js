import React from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'

const DocumentFieldsComponent = ({ fields }) => {
  const fieldMap = fields.map((field) => {
    switch (field.type) {
      case Constants.FIELD_TYPES.STRING: {
        return 'String!'
      }
      case Constants.FIELD_TYPES.TEXT: {
        return 'Text!'
      }
      case Constants.FIELD_TYPES.NUMBER: {
        return 'Number!'
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

export default DocumentFieldsComponent
