import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Constants from 'Shared/constants'
import { updateField } from 'Actions/field'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'

const DocumentFieldsContainer = ({ documentId, fields, updateField }) => {
  function fieldDestroyHandler(e) {
  }
  function fieldChangeHandler(fieldId, value) {
    // left this console in to make sure we're not hammering the API because of useEffect
    console.info(`Field: ${fieldId} trigger changeHandler`)
    updateField(documentId, fieldId, {
      docId: documentId,
      id: fieldId,
      value: value
    })
  }
  const fieldMap = Object.keys(fields).map((fieldId) => {
    const field = fields[fieldId]
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
  documentId: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
  updateField: PropTypes.func.isRequired
}

DocumentFieldsContainer.defaultProps = {
  documentId: -1,
  fields: {}
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = { updateField }

export default connect(mapStateToProps, mapDispatchToProps)(DocumentFieldsContainer)
