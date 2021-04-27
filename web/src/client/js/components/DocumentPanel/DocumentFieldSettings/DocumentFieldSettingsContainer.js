import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { debounce } from 'Shared/utilities'
import { updateField } from 'Actions/field'
import { selectDocumentPanelTab } from 'Actions/documentPanel'
import DocumentFieldSettingsComponent from './DocumentFieldSettingsComponent'

const DocumentFieldSettingsContainer = ({
  documentFields,
  selectDocumentPanelTab,
  selectedFieldId,
  updateField,
  updatingDocumentFields
}) => {
  const { projectId, documentId } = useParams()

  if (!documentId) return null

  const selectedField = documentFields[documentId][selectedFieldId]
  const fieldIsUpdating = updatingDocumentFields[selectedFieldId]

  if (!selectedField) {
    return (
      <div className="document-panel__blank">
        <button className="btn btn--like-a-link" onClick={() => { selectDocumentPanelTab(1) }}>
          Select a field to edit
        </button>
      </div>
    )
  }

  const updateFieldHandler = debounce(1000, (body) => {
    updateField(projectId, documentId, selectedFieldId, body)
  })

  return (
    <DocumentFieldSettingsComponent
      field={selectedField}
      isUpdating={fieldIsUpdating}
      updateHandler={updateFieldHandler}
    />
  )
}

DocumentFieldSettingsContainer.propTypes = {
  documentFields: PropTypes.object.isRequired,
  selectDocumentPanelTab: PropTypes.func.isRequired,
  selectedFieldId: PropTypes.number,
  updateField: PropTypes.func.isRequired,
  updatingDocumentFields: PropTypes.object.isRequired,
}

const mapDispatchToProps = {
  updateField,
  selectDocumentPanelTab
}

const mapStateToProps = (state) => {
  return {
    documentFields: state.documentFields.documentFieldsById,
    selectedFieldId: state.documentPanel.fields.selectedFieldId,
    updatingDocumentFields: state.documentFields.loading.byId,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentFieldSettingsContainer)
