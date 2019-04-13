import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Constants from 'Shared/constants'
import { createField, updateField } from 'Actions/field'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'

const DocumentFieldsContainer = ({ createField, creating, documentId, fields, fieldType, updateField }) => {
  function fieldDestroyHandler(e) {
    // console.log('Destroy!')
    // console.log({ e })
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
  function renderCreateNewFieldWithName() {
    return (
      <div className="document__field-create-input">
        <label htmlFor="create-field-name">First, name your field</label>
        <input
          type="text"
          name="create-field-name"
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') {
              createField(documentId, {
                docId: documentId,
                name: e.target.value,
                type: fieldType,
                value: ''
              })
            }
          }} />
      </div>
    )
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
    <div className="document__fields">
      {fieldMap}
      {creating && fieldType !== -1 &&
      renderCreateNewFieldWithName()
      }
    </div>
  )
}

DocumentFieldsContainer.propTypes = {
  creating: PropTypes.bool,
  createField: PropTypes.func.isRequired,
  documentId: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
  fieldType: PropTypes.number,
  updateField: PropTypes.func.isRequired
}

DocumentFieldsContainer.defaultProps = {
  documentId: -1,
  fields: {}
}

const mapStateToProps = (state) => {
  return {
    creating: state.ui.fields.creating,
    fieldType: state.ui.fields.type
  }
}

const mapDispatchToProps = { createField, updateField }

export default connect(mapStateToProps, mapDispatchToProps)(DocumentFieldsContainer)
