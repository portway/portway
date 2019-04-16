import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { updateField, removeField } from 'Actions/field'

import DocumentFieldsComponent from './DocumentFieldsComponent'

const DocumentFieldsContainer = ({ match, removeField, updateField, ui }) => {
  const { documentId } = match.params
  const uiState = ui.fields
  const { data: fields } = useDataService(dataMapper.fields.list(match.params.documentId), [match.params.documentId])
  if (!fields) return null

  function fieldDestroyHandler(fieldId) {
    console.info(`Remove ${fieldId} when you can add them...`) // I just can't add them yet and this is our only field
    // removeField(documentId, fieldId)
  }
  function fieldChangeHandler(fieldId, body) {
    // leave this console in to make sure we're not hammering the API because of useEffect
    console.info(`Field: ${fieldId} trigger changeHandler`)
    updateField(documentId, fieldId, body)
  }
  // Convert fields object to an array for rendering
  const fieldMap = Object.keys(fields).map((fieldId) => {
    return fields[fieldId]
  })
  return (
    <DocumentFieldsComponent creating={uiState.creating} fields={fieldMap} fieldChangeHandler={fieldChangeHandler} fieldDestroyHandler={fieldDestroyHandler} />
  )
}

DocumentFieldsContainer.propTypes = {
  match: PropTypes.object.isRequired,
  removeField: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui
  }
}

const mapDispatchToProps = { removeField, updateField }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentFieldsContainer)
)
