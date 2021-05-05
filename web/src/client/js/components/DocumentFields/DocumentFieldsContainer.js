import React, { useCallback, useEffect, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { FIELD_TYPES } from 'Shared/constants'
import { debounce, getNewNameInSequence } from 'Shared/utilities'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import { uiConfirm } from 'Actions/ui'
import { toggleDocumentPanel, selectDocumentPanelTab, selectDocumentField } from 'Actions/documentPanel'
import { blurField, createField, focusField, updateField } from 'Actions/field'
import { fetchDocument } from 'Actions/document'

import DocumentFieldsComponent from './DocumentFieldsComponent'
import isDocumentReadOnly from '../../utilities/isDocumentReadOnly'

const DocumentFieldsContainer = ({
  activeDocumentUsers,
  blurField,
  createdFieldId,
  createField,
  disabled,
  fetchDocument,
  fieldsUpdating,
  focusField,
  isPublishing,
  selectDocumentField,
  selectDocumentPanelTab,
  toggleDocumentPanel,
  updateField
}) => {
  const { projectId, documentId } = useParams()
  const fieldKeys = useRef([])
  const docAreaRef = useRef()
  const { data: foundFields } = useDataService(dataMapper.fields.list(documentId), [documentId])
  const { data: userProjectAssignments = {}, loading: assignmentLoading } = useDataService(dataMapper.users.currentUserProjectAssignments())
  const { data: project } = useDataService(dataMapper.projects.id(projectId), [projectId])
  const activeUsers = activeDocumentUsers[documentId]
  const projectAssignment = userProjectAssignments[Number(projectId)]
  const fields = foundFields || {}

  const documentReadOnlyMode = isDocumentReadOnly(assignmentLoading, projectAssignment, project.accessLevel)

  const sortedFields = useMemo(() => {
    fieldKeys.current = Object.keys(fields)

    const fieldMapTemp = fieldKeys.current.map((fieldId) => {
      return fields[fieldId]
    })
    fieldMapTemp.sort((a, b) => {
      return a.order - b.order
    })
    return fieldMapTemp
  }, [fields])

  const hasFields = fieldKeys.current.length >= 1
  const hasOnlyOneTextField = hasFields && sortedFields.length === 1 && fields[sortedFields[0].id].type === FIELD_TYPES.TEXT

  const createTextFieldHandler = useCallback(() => {
    if (!documentReadOnlyMode && parseInt(documentId) && parseInt(projectId)) {
      // This is triggered by the Big Invisible Button™
      // It should append a new text field to the end of the document, making it seem as though the
      // user is clicking to continue the document body
      const newName = getNewNameInSequence(fields, FIELD_TYPES.TEXT)
      createField(projectId, documentId, FIELD_TYPES.TEXT, {
        name: newName,
        type: FIELD_TYPES.TEXT
      })
    }
  }, [documentReadOnlyMode, fields, createField, documentId, projectId])

  // This listener handles the scenario where a document has already been created
  // and has no fields. The document create action creates a text field, so the user would
  // need to delete all the fields, or create a document via the API in order to have no fields
  useEffect(() => {
    if (
      docAreaRef && docAreaRef.current &&
      !hasFields && foundFields && Object.keys(foundFields).length === 0
    ) {
      const dar = docAreaRef.current
      dar.addEventListener('click', createTextFieldHandler, false)
      return function cleanup() {
        dar.removeEventListener('click', createTextFieldHandler, false)
      }
    }
  // Check hasFields and foundFields. hasFields provides an already computed quick check, and
  // foundFields is the value from the redux store. We want to explicitly look at foundFields to
  // determine 1) have the fields loaded 2) are there any fields
  }, [hasFields, foundFields, createTextFieldHandler])

  useEffect(() => {
    // If we are in a new document, or a document with one blank text field,
    // clicking anywhere within the document should focus that field
    function documentClickHandler(e) {
      const target = e.target.classList
      // If we're clicking the document, focus the first text field
      if (target.contains('document') || target.contains('document__fields')) {
        const cm = document.querySelector('.CodeMirror').CodeMirror
        cm.focus()
      }
    }
    if (hasOnlyOneTextField) {
      document.addEventListener('click', documentClickHandler, false)
      return function cleanup() {
        document.removeEventListener('click', documentClickHandler, false)
      }
    }
  }, [hasOnlyOneTextField])

  // Actions
  function fieldFocusHandler(fieldId, fieldType, documentId, fieldData) {
    // Unfortunately we're tracking focus state both in redux and within the sync
    // context. We may want to look into hooking sync into redux? -Dirk 4/20
    if (!documentReadOnlyMode) {
      selectDocumentField(fieldId)
      focusField(fieldId, fieldType, documentId, fieldData)
    }
  }

  function fieldBlurHandler(fieldId, fieldType, documentId, fieldData) {
    if (!documentReadOnlyMode) {
      selectDocumentField(null)
      blurField(fieldId, fieldType, documentId, fieldData)
    }
  }

  function fieldChangeHandler(fieldId, body) {
    if (!documentReadOnlyMode) {
      updateField(projectId, documentId, fieldId, body)
    }
  }

  function fieldDiscardHandler(documentId) {
    fetchDocument(documentId)
  }

  // Prop handler
  const debouncedValueChangeHandler = debounce(1000, (fieldId, value) => {
    fieldChangeHandler(fieldId, { value: value })
  })
  const debouncedNameChangeHandler = debounce(1000, (fieldId, value) => {
    if (value === '') return
    fieldChangeHandler(fieldId, { name: value })
  })
  function openSettingsForFieldHandler(fieldId) {
    toggleDocumentPanel(true)
    selectDocumentPanelTab(2)
    selectDocumentField(fieldId)
  }

  return (
    <DocumentFieldsComponent
      activeUsers={activeUsers}
      createdFieldId={createdFieldId}
      createFieldHandler={createTextFieldHandler}
      disabled={disabled}
      fieldBlurHandler={fieldBlurHandler}
      fieldChangeHandler={debouncedValueChangeHandler}
      fieldDiscardHandler={fieldDiscardHandler}
      fieldFocusHandler={fieldFocusHandler}
      fieldRenameHandler={debouncedNameChangeHandler}
      fields={sortedFields}
      fieldSettingsHandler={openSettingsForFieldHandler}
      fieldsUpdating={fieldsUpdating}
      isPublishing={isPublishing}
      readOnly={documentReadOnlyMode}
      ref={docAreaRef}
    />
  )
}

DocumentFieldsContainer.propTypes = {
  blurField: PropTypes.func.isRequired,
  createField: PropTypes.func.isRequired,
  createdFieldId: PropTypes.number,
  disabled: PropTypes.bool.isRequired,
  fieldsUpdating: PropTypes.object.isRequired,
  focusField: PropTypes.func.isRequired,
  isPublishing: PropTypes.bool.isRequired,
  updateField: PropTypes.func.isRequired,
  fetchDocument: PropTypes.func.isRequired,
  activeDocumentUsers: PropTypes.object,
  selectDocumentField: PropTypes.func.isRequired,
  selectDocumentPanelTab: PropTypes.func.isRequired,
  toggleDocumentPanel: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    activeDocumentUsers: state.userSync.activeDocumentUsers,
    createdFieldId: state.documentFields.lastCreatedFieldId,
    disabled: state.ui.fields.disabled,
    fieldsUpdating: state.ui.fields.fieldsUpdating,
    isPublishing: state.ui.documents.isPublishing,
  }
}

const mapDispatchToProps = {
  blurField,
  createField,
  fetchDocument,
  focusField,
  selectDocumentField,
  selectDocumentPanelTab,
  toggleDocumentPanel,
  uiConfirm,
  updateField,
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentFieldsContainer)
