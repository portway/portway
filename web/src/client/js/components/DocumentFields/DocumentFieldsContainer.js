import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { debounce } from 'Shared/utilities'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { updateField, removeField } from 'Actions/field'

import DocumentFieldsComponent from './DocumentFieldsComponent'

const DocumentFieldsContainer = ({ creating, match, removeField, updateField }) => {
  const { documentId } = match.params
  const { data: fields } = useDataService(dataMapper.fields.list(match.params.documentId), [match.params.documentId])
  if (!fields) return null

  // Actions
  function fieldDestroyHandler(fieldId) {
    console.info(`Remove ${fieldId} when you can add them...`) // I just can't add them yet and this is our only field
    // removeField(documentId, fieldId)
  }
  function fieldChangeHandler(fieldId, body) {
    // leave this console in to make sure we're not hammering the API because of useEffect
    console.info(`Field: ${fieldId} trigger changeHandler`)
    updateField(documentId, fieldId, body)
  }

  // Prop handler
  const debouncedValueChangeHandler = debounce(1000, (fieldId, value) => {
    fieldChangeHandler(fieldId, { value: value })
  })
  const debouncedNameChangeHandler = debounce(1000, (fieldId, value) => {
    fieldChangeHandler(fieldId, { name: value })
  })

  // Convert fields object to an array for rendering
  const fieldMap = Object.keys(fields).map((fieldId) => {
    return fields[fieldId]
  })
  return (
    <DocumentFieldsComponent
      creating={creating}
      fields={fieldMap}
      fieldChangeHandler={debouncedValueChangeHandler}
      fieldRenameHandler={debouncedNameChangeHandler}
      fieldDestroyHandler={fieldDestroyHandler} />
  )
}

DocumentFieldsContainer.propTypes = {
  creating: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  removeField: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    creating: state.ui.fields.creating
  }
}

const mapDispatchToProps = { removeField, updateField }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentFieldsContainer)
)
