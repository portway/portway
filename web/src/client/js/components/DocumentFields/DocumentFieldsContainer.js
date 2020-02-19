import React, { useState, useEffect, useRef, useContext } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { FIELD_TYPES, PROJECT_ROLE_IDS } from 'Shared/constants'
import { debounce, getNewNameInSequence } from 'Shared/utilities'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { blurField, createField, focusField, updateField } from 'Actions/field'
import { socketStore, updateDocumentRoomUsers, setCurrentDocumentRoom } from '../../sockets/SocketProvider'

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
}) => {
  const { projectId, documentId } = useParams()
  const readOnlyRoleIds = [PROJECT_ROLE_IDS.READER]
  const { data: fields = {} } = useDataService(dataMapper.fields.list(documentId), [documentId])
  const { data: userProjectAssignments = {}, loading: assignmentLoading } = useDataService(dataMapper.users.currentUserProjectAssignments())

  const { state: socketState, dispatch: socketDispatch, documentSocket } = useContext(socketStore)

  const activeUsers = socketState.activeDocumentUsers[documentId]
  const currentDocumentRoom = socketState.currentDocumentRoom

  // =============================== Web Sockets ====================================

  useEffect(() => {
    documentSocket.emit('joinRoom', documentId)
    socketDispatch(setCurrentDocumentRoom(documentId))
    documentSocket.on('userChange', (userIds) => {
      socketDispatch(updateDocumentRoomUsers(documentId, userIds))
    })
    return () => {
      if (currentDocumentRoom) {
        documentSocket.emit('leaveRoom', currentDocumentRoom)
        setCurrentDocumentRoom(null)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId])

  // =================================================================================

  // Sort the fields every re-render
  const fieldKeys = Object.keys(fields)
  const fieldMap = fieldKeys.map((fieldId) => {
    return fields[fieldId]
  })
  fieldMap.sort((a, b) => {
    return a.order - b.order
  })

  const hasFields = fieldKeys.length >= 1
  const hasOnlyOneTextField = hasFields && fieldMap.length === 1 && fields[fieldMap[0].id].type === FIELD_TYPES.TEXT

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

  const projectAssignment = userProjectAssignments[Number(projectId)]

  let documentReadOnlyMode = false
  // False because null / true == loading
  if (assignmentLoading === false) {
    documentReadOnlyMode = projectAssignment === undefined || readOnlyRoleIds.includes(projectAssignment.roleId)
  }

  // Actions
  function createTextFieldHandler() {
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
  }

  function fieldFocusHandler(fieldId, fieldType, fieldData) {
    if (!documentReadOnlyMode) {
      focusField(fieldId, fieldType, fieldData)
    }
  }

  function fieldBlurHandler(fieldId, fieldType, fieldData) {
    if (!documentReadOnlyMode) {
      blurField(fieldId, fieldType, fieldData)
    }
  }

  function fieldChangeHandler(fieldId, body) {
    if (!documentReadOnlyMode) {
      // leave this console in to make sure we're not hammering the API because of useEffect
      // console.info(`Field: ${fieldId} trigger changeHandler`)
      updateField(projectId, documentId, fieldId, body)
    }
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
      activeUsers ={activeUsers}
      createFieldHandler={createTextFieldHandler}
      createdFieldId={createdFieldId}
      disabled={disabled}
      fieldChangeHandler={debouncedValueChangeHandler}
      fieldFocusHandler={fieldFocusHandler}
      fieldBlurHandler={fieldBlurHandler}
      fieldRenameHandler={debouncedNameChangeHandler}
      fields={fieldMap}
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
}

const mapStateToProps = (state) => {
  return {
    createdFieldId: state.documentFields.lastCreatedFieldId,
    disabled: state.ui.fields.disabled,
    fieldsUpdating: state.ui.fields.fieldsUpdating,
    isPublishing: state.ui.documents.isPublishing,
  }
}

const mapDispatchToProps = {
  blurField,
  createField,
  focusField,
  updateField,
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentFieldsContainer)
