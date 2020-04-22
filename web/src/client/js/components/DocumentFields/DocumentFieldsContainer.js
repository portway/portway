import React, { useCallback, useEffect, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { FIELD_TYPES, PROJECT_ROLE_IDS } from 'Shared/constants'
import { debounce, getNewNameInSequence } from 'Shared/utilities'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import { uiConfirm } from 'Actions/ui'
import { blurField, createField, focusField, updateField } from 'Actions/field'
import { fetchDocument } from 'Actions/document'

import DocumentFieldsComponent from './DocumentFieldsComponent'

const DocumentFieldsContainer = ({
  blurField,
  createField,
  createdFieldId,
  disabled,
  fieldsUpdating,
  focusField,
  isPublishing,
  updateField,
  fetchDocument,
  activeDocumentUsers
}) => {
  const { projectId, documentId } = useParams()
  const fieldKeys = useRef([])
  const { data: fields = {} } = useDataService(dataMapper.fields.list(documentId), [documentId])
  const { data: userProjectAssignments = {}, loading: assignmentLoading } = useDataService(dataMapper.users.currentUserProjectAssignments())
  const activeUsers = activeDocumentUsers[documentId]
  const projectAssignment = userProjectAssignments[Number(projectId)]

  const readOnlyRoleIds = [PROJECT_ROLE_IDS.READER]
  let documentReadOnlyMode = false
  // False because null / true == loading
  if (assignmentLoading === false) {
    documentReadOnlyMode = projectAssignment === undefined || readOnlyRoleIds.includes(projectAssignment.roleId)
  }

  const sortedFields = useMemo(() => {
    // Sort the fields every re-render
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
    if (!documentReadOnlyMode) {
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

  useEffect(() => {
    if (!hasFields) {
      document.addEventListener('click', createTextFieldHandler, false)
      return function cleanup() {
        document.removeEventListener('click', createTextFieldHandler, false)
      }
    }
  }, [createTextFieldHandler, hasFields])

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
  function fieldFocusHandler(fieldId, fieldType, fieldData) {
    // Unfortunately we're tracking focus state both in redux and within the sync
    // context. We may want to look into hooking sync into redux? -Dirk 4/20
    if (!documentReadOnlyMode) {
      focusField(fieldId, fieldType, fieldData)
    }
  }

  function fieldBlurHandler(fieldId, fieldType) {
    if (!documentReadOnlyMode) {
      blurField(fieldId, fieldType)
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

  return (
    <DocumentFieldsComponent
      activeUsers={activeUsers}
      createFieldHandler={createTextFieldHandler}
      createdFieldId={createdFieldId}
      disabled={disabled}
      fieldChangeHandler={debouncedValueChangeHandler}
      fieldFocusHandler={fieldFocusHandler}
      fieldBlurHandler={fieldBlurHandler}
      fieldRenameHandler={debouncedNameChangeHandler}
      fieldDiscardHandler={fieldDiscardHandler}
      fields={sortedFields}
      fieldsUpdating={fieldsUpdating}
      isPublishing={isPublishing}
      readOnly={documentReadOnlyMode}
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
  activeDocumentUsers: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    createdFieldId: state.documentFields.lastCreatedFieldId,
    disabled: state.ui.fields.disabled,
    fieldsUpdating: state.ui.fields.fieldsUpdating,
    isPublishing: state.ui.documents.isPublishing,
    activeDocumentUsers: state.userSync.activeDocumentUsers
  }
}

const mapDispatchToProps = {
  blurField,
  createField,
  focusField,
  updateField,
  uiConfirm,
  fetchDocument
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentFieldsContainer)
