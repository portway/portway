import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { debounce } from 'Shared/utilities'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { uiConfirm } from 'Actions/ui'
import { updateField, removeField, updateFieldOrder } from 'Actions/field'

import DocumentFieldsComponent from './DocumentFieldsComponent'

const DocumentFieldsContainer = ({
  createdFieldId,
  documentMode,
  disabled,
  fieldsUpdating,
  isPublishing,
  match,
  removeField,
  uiConfirm,
  updateField,
  updateFieldOrder,
}) => {
  const [orderedFields, setOrderedFields] = useState([])
  const [draggingElement, setDraggingElement] = useState(null)
  const { projectId, documentId } = match.params
  const { data: fields = {} } = useDataService(dataMapper.fields.list(match.params.documentId), [match.params.documentId])

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
  function fieldDestroyHandler(fieldId) {
    const message = <span>Are you sure you want to delete <span className="highlight">{fields[fieldId].name}</span>?</span>
    const confirmedLabel = 'Yes, delete it.'
    const confirmedAction = () => { removeField(projectId, documentId, fieldId) }
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }

  function fieldChangeHandler(fieldId, body) {
    // leave this console in to make sure we're not hammering the API because of useEffect
    console.info(`Field: ${fieldId} trigger changeHandler`)
    updateField(projectId, documentId, fieldId, body)
  }

  // Drag and drop
  const blankDragImage = new Image()
  blankDragImage.width = 600
  blankDragImage.height = 400

  function dragStartHandler(e) {
    const listItem = e.currentTarget
    setDraggingElement(listItem)
    // event.dataTransfer.setDragImage(blankDragImage, 0, 0)
    // Add the class just after the browser makes the copy for the browser UI
    window.requestAnimationFrame(() => { listItem.classList.add('document-field--dragging') })
    e.dataTransfer.effectAllowed = 'copyMove'
    e.dataTransfer.setData('fieldid', listItem.dataset.id)
    e.dataTransfer.setData('documentid', documentId)
    e.dataTransfer.setData('text/html', listItem)
  }
  function dragEnterHandler(e) {
    e.preventDefault()
    if (e.dataTransfer.types.includes('Files')) {
      return false
    }
  }
  function dragOverHandler(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (e.currentTarget === draggingElement) return
    if (e.dataTransfer.types.includes('Files')) {
      return
    }
    // Set the height of the element we're dragging to prevent any weirdness
    // if the dragged over element is really tall, and it moves on drag
    window.requestAnimationFrame(() => {
      draggingElement.style.height = e.currentTarget.offsetHeight + 'px'
    })
    // Swap the fields on drag over
    const from = Number(draggingElement.dataset.order)
    const to = Number(e.currentTarget.dataset.order)
    const fieldData = [...orderedFields]
    fieldData.splice(to, 0, fieldData.splice(from, 1)[0])
    setOrderedFields(fieldData)
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
    const to = Number(e.currentTarget.dataset.order)
    draggingElement.classList.remove('document-field--dragging')
    setDraggingElement(null)
    // Trigger action with documentId, fieldId
    updateFieldOrder(documentId, fieldIdToUpdate, to)
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
      dragEnterHandler={dragEnterHandler}
      dragOverHandler={dragOverHandler}
      dragStartHandler={dragStartHandler}
      dropHandler={dropHandler}
      fieldChangeHandler={debouncedValueChangeHandler}
      fieldDestroyHandler={fieldDestroyHandler}
      fieldRenameHandler={debouncedNameChangeHandler}
      fields={orderedFields}
      fieldsUpdating={fieldsUpdating}
      isPublishing={isPublishing}
    />
  )
}

DocumentFieldsContainer.propTypes = {
  createdFieldId: PropTypes.number,
  disabled: PropTypes.bool.isRequired,
  documentMode: PropTypes.string,
  fieldsUpdating: PropTypes.object.isRequired,
  isPublishing: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
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

const mapDispatchToProps = { removeField, updateField, updateFieldOrder, uiConfirm }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentFieldsContainer)
)
