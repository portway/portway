import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { FIELD_TYPES, PROJECT_ROLE_IDS } from 'Shared/constants'
import { debounce, getNewNameInSequence, isAnyPartOfElementInViewport } from 'Shared/utilities'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { uiConfirm } from 'Actions/ui'
import { blurField, createField, focusField, updateField, removeField, updateFieldOrder } from 'Actions/field'

import { DocumentIcon } from 'Components/Icons'
import DocumentFieldsComponent from './DocumentFieldsComponent'

const DocumentFieldsContainer = ({
  blurField,
  createField,
  createdFieldId,
  documentMode,
  disabled,
  fieldsUpdating,
  focusField,
  isPublishing,
  removeField,
  uiConfirm,
  updateField,
  updateFieldOrder,
}) => {
  const [orderedFields, setOrderedFields] = useState([])
  const [dropped, setDropped] = useState(false)
  const draggingElement = useRef(null)
  const { projectId, documentId } = useParams()
  const readOnlyRoleIds = [PROJECT_ROLE_IDS.READER]
  const { data: fields = {}, loading: fieldsLoading } = useDataService(dataMapper.fields.list(documentId), [documentId])
  const { data: userProjectAssignments = {}, loading: assignmentLoading } = useDataService(dataMapper.users.currentUserProjectAssignments())

  // Convert fields object to a sorted array for rendering
  const fieldIds = Object.keys(fields)
  useEffect(() => {
    const fieldMap = fieldIds.map((fieldId) => {
      return fields[fieldId]
    })
    fieldMap.sort((a, b) => {
      return a.order - b.order
    })
    setOrderedFields(fieldMap)
    // Note: this is not an ideal dependency but if fields aren't loaded and then load
    // it will appropriately set the order. `fields` cannot be a dependency as it's an object.
    // When field order is changed, other handlers will correctly set the ordered fields and
    // we do not want this effect to run in those cases.
    // eslint-disable-next-line
  }, [fieldIds.length])

  const hasOnlyOneTextField = fieldIds.length === 1 && fields[fieldIds[0]].type === FIELD_TYPES.TEXT
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
  let documentReadOnlyMode
  // False because null / true == loading
  if (assignmentLoading === false) {
    documentReadOnlyMode = projectAssignment === undefined || readOnlyRoleIds.includes(projectAssignment.roleId)
  }

  if (fieldsLoading || assignmentLoading) {
    const overlayDark = getComputedStyle(document.documentElement).getPropertyValue('--theme-overlay-dark')
    return (
      <div className="document__loading">
        <DocumentIcon width="84" height="84" fill={overlayDark} />
        <p>Loading</p>
      </div>
    )
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

  function fieldDestroyHandler(fieldId, fieldType) {
    if (!documentReadOnlyMode) {
      let type = 'field'

      switch (fieldType) {
        case FIELD_TYPES.IMAGE:
          type = 'image'
          break
        case FIELD_TYPES.STRING:
          type = 'string'
          break
        case FIELD_TYPES.NUMBER:
          type = 'number'
          break
        case FIELD_TYPES.TEXT:
          type = 'text'
          break
        default:
          break
      }

      const message = <span>Are you sure you want to delete this {type}?</span>
      const confirmedLabel = 'Yes, delete it.'
      const confirmedAction = () => { removeField(projectId, documentId, fieldId) }
      uiConfirm({ message, confirmedAction, confirmedLabel })
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

  let cloneElement
  function dragStartHandler(e) {
    // console.info('drag start')
    e.stopPropagation()
    if (documentReadOnlyMode) return
    const listItem = e.currentTarget
    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.effectAllowed = 'copyMove'
    e.dataTransfer.setData('fieldid', listItem.dataset.id)
    e.dataTransfer.setData('documentid', documentId)
    e.dataTransfer.setData('text/html', listItem)
    draggingElement.current = listItem

    // Create a clone of the item and append it to the document
    // This is for dragging around a clone of the item we're dragging
    // this is in a timeout due to a browser bug with dragEnd immediately firing
    // when DOM is manipulated in dragStart

    cloneElement = listItem.cloneNode(true)
    cloneElement.style.position = 'absolute'
    cloneElement.style.zIndex = '-1'
    cloneElement.style.width = `${listItem.offsetWidth}px`
    cloneElement.classList.add('document-field--clone-element')
    cloneElement.setAttribute('draggable', false)
    cloneElement.setAttribute('id', 'clone-element')
    document.body.appendChild(cloneElement)

    // Make the default, blurry image of the dragged item disappear
    e.dataTransfer.setDragImage(cloneElement, 10, 10)

    setTimeout(() => {
      listItem.classList.add('document-field--dragging')
    }, 200)
  }

  function dragEnterHandler(e) {
    // console.info('drag enter', draggingElement)
    e.preventDefault()
    e.stopPropagation()
    if (documentReadOnlyMode) return
    e.dataTransfer.dropEffect = 'move'
    if (e.dataTransfer.types.includes('Files')) {
      return
    }

    // Swap the fields on drag enter
    const from = Number(draggingElement.current.dataset.order)
    const to = Number(e.currentTarget.dataset.order)
    const fieldData = [...orderedFields]
    fieldData.splice(to, 0, fieldData.splice(from, 1)[0])
    setOrderedFields(fieldData)
    // If the item we're dragging is nowhere in the viewport,
    // scroll to it
    window.requestAnimationFrame(() => {
      if (!isAnyPartOfElementInViewport(draggingElement.current)) {
        draggingElement.current.scrollIntoView(false, {
          // behavior: 'smooth'
        })
      }
    })
  }

  // This is here for debugging
  function dragLeaveHandler(e) {
    // console.info('drag leave', draggingElement)
    e.preventDefault()
    e.stopPropagation()
  }

  function dropHandler(e) {
    // console.info('drag drop', draggingElement)
    e.preventDefault()
    e.stopPropagation()
    if (documentReadOnlyMode) return
    if (e.dataTransfer.types.includes('Files')) {
      return
    }
    const fieldIdToUpdate = draggingElement.current.dataset.id
    const to = Number(draggingElement.current.dataset.order)
    draggingElement.current.classList.remove('document-field--dragging')
    draggingElement.current.setAttribute('draggable', 'false')
    // Trigger action with documentId, fieldId
    updateFieldOrder(documentId, fieldIdToUpdate, to)
  }

  function dragEndHandler(e) {
    // console.info('drag end', draggingElement)
    e.preventDefault()
    e.stopPropagation()
    if (documentReadOnlyMode) return
    draggingElement.current.classList.remove('document-field--dragging')
    document.querySelector('#clone-element').remove()

    draggingElement.current = null
    setDropped(!dropped)
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
      createFieldHandler={createTextFieldHandler}
      createdFieldId={createdFieldId}
      disabled={disabled}
      documentMode={documentMode}
      dragEndHandler={dragEndHandler}
      dragEnterHandler={dragEnterHandler}
      dragLeaveHandler={dragLeaveHandler}
      dragStartHandler={dragStartHandler}
      dropHandler={dropHandler}
      fieldChangeHandler={debouncedValueChangeHandler}
      fieldDestroyHandler={fieldDestroyHandler}
      fieldFocusHandler={fieldFocusHandler}
      fieldBlurHandler={fieldBlurHandler}
      fieldRenameHandler={debouncedNameChangeHandler}
      fields={orderedFields}
      fieldsUpdating={fieldsUpdating}
      isDragging={draggingElement.current != null}
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
  documentMode: PropTypes.string,
  fieldsUpdating: PropTypes.object.isRequired,
  focusField: PropTypes.func.isRequired,
  isPublishing: PropTypes.bool.isRequired,
  removeField: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  updateFieldOrder: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    createdFieldId: state.documentFields.lastCreatedFieldId,
    disabled: state.ui.fields.disabled,
    documentMode: state.ui.document.documentMode,
    fieldsUpdating: state.ui.fields.fieldsUpdating,
    isPublishing: state.ui.documents.isPublishing,
  }
}

const mapDispatchToProps = {
  blurField,
  createField,
  focusField,
  removeField,
  updateField,
  updateFieldOrder,
  uiConfirm
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentFieldsContainer)
