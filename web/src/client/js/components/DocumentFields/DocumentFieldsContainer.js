import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { FIELD_TYPES } from 'Shared/constants'
import { debounce, isAnyPartOfElementInViewport } from 'Shared/utilities'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { uiConfirm } from 'Actions/ui'
import { blurField, focusField, updateField, removeField, updateFieldOrder } from 'Actions/field'

import DocumentFieldsComponent from './DocumentFieldsComponent'

const DocumentFieldsContainer = ({
  blurField,
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
  const [draggingElement, setDraggingElement] = useState(null)
  const params = useParams()
  const { projectId, documentId } = params
  const { data: fields = {} } = useDataService(dataMapper.fields.list(documentId), [documentId])

  let cloneElement

  // Convert fields object to a sorted array for rendering
  useEffect(() => {
    const fieldMap = Object.keys(fields).map((fieldId) => {
      return fields[fieldId]
    })
    fieldMap.sort((a, b) => {
      return a.order - b.order
    })
    setOrderedFields(fieldMap)
  }, [fields])

  // Actions
  function fieldDestroyHandler(fieldId, fieldType) {
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

  function fieldFocusHandler(fieldId, fieldType, fieldData) {
    focusField(fieldId, fieldType, fieldData)
  }

  function fieldBlurHandler(fieldId, fieldType, fieldData) {
    blurField(fieldId, fieldType, fieldData)
  }

  function fieldChangeHandler(fieldId, body) {
    // leave this console in to make sure we're not hammering the API because of useEffect
    console.info(`Field: ${fieldId} trigger changeHandler`)
    updateField(projectId, documentId, fieldId, body)
  }

  function dragStartHandler(e) {
    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.effectAllowed = 'copyMove'
    const listItem = e.currentTarget

    // Create a clone of the item and append it to the document
    // This is for dragging around a clone of the item we're dragging
    cloneElement = listItem.cloneNode(true)
    cloneElement.style.position = 'absolute'
    cloneElement.style.zIndex = '101'
    cloneElement.style.width = `${listItem.offsetWidth}px`
    cloneElement.classList.add('document-field--clone-element')
    cloneElement.setAttribute('draggable', false)
    cloneElement.setAttribute('id', 'clone-element')
    document.body.appendChild(cloneElement)
    setDraggingElement(listItem)

    // Make the default, blurry image of the dragged item disappear
    event.dataTransfer.setDragImage(cloneElement, 10, 10)

    // Add the class just after the browser makes the copy for the browser UI
    window.requestAnimationFrame(() => { listItem.classList.add('document-field--dragging') })
    e.dataTransfer.setData('fieldid', listItem.dataset.id)
    e.dataTransfer.setData('documentid', documentId)
    e.dataTransfer.setData('text/html', listItem)
  }

  function dragEnterHandler(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    // if (e.currentTarget === draggingElement) return
    if (e.dataTransfer.types.includes('Files')) {
      return
    }

    // Swap the fields on drag enter
    const from = Number(draggingElement.dataset.order)
    const to = Number(e.currentTarget.dataset.order)
    const fieldData = [...orderedFields]
    fieldData.splice(to, 0, fieldData.splice(from, 1)[0])
    setOrderedFields(fieldData)
    // If the item we're dragging is nowhere in the viewport,
    // scroll to it
    window.requestAnimationFrame(() => {
      if (!isAnyPartOfElementInViewport(draggingElement)) {
        draggingElement.scrollIntoView(false, {
          // behavior: 'smooth'
        })
      }
    })
  }

  // This is here for debugging
  function dragLeaveHandler(e) {
    e.preventDefault()
    // dragCounter--
  }

  function dropHandler(e) {
    e.preventDefault()
    if (e.stopPropagation) {
      e.stopPropagation()
    }
    if (e.dataTransfer.types.includes('Files')) {
      return
    }
    const fieldIdToUpdate = draggingElement.dataset.id
    const to = Number(draggingElement.dataset.order)
    draggingElement.classList.remove('document-field--dragging')
    // Trigger action with documentId, fieldId
    updateFieldOrder(documentId, fieldIdToUpdate, to)
  }

  function dragEndHandler(e) {
    e.preventDefault()
    draggingElement.classList.remove('document-field--dragging')
    setDraggingElement(null)
    document.querySelector('#clone-element').remove()
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
      isDragging={draggingElement !== null}
      isPublishing={isPublishing}
    />
  )
}

DocumentFieldsContainer.propTypes = {
  blurField: PropTypes.func.isRequired,
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
  focusField,
  removeField,
  updateField,
  updateFieldOrder,
  uiConfirm
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentFieldsContainer)
