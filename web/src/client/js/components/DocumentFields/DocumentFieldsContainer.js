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
  creating, createdFieldId, isPublishing, match, removeField, updateField, updateFieldOrder, uiConfirm
}) => {
  const [orderedFields, setOrderedFields] = useState([])
  const [draggingElement, setDraggingElement] = useState(null)
  const { documentId } = match.params
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
    const confirmedAction = () => { removeField(documentId, fieldId) }
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }

  function fieldChangeHandler(fieldId, body) {
    // leave this console in to make sure we're not hammering the API because of useEffect
    console.info(`Field: ${fieldId} trigger changeHandler`)
    updateField(documentId, fieldId, body)
  }

  // Drag and drop
  let dragCount = 0

  function dragStartHandler(e) {
    setDraggingElement(e.currentTarget)
    e.currentTarget.classList.add('document-field--dragging')
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.setData('fieldid', e.currentTarget.dataset.id)
    e.dataTransfer.setData('documentid', documentId)
    e.dataTransfer.setData('text/html', e.target)
  }
  function dragEnterHandler(e) {
    e.preventDefault()
    if (e.dataTransfer.types.includes('Files')) {
      return false
    }
    dragCount++
    e.currentTarget.classList.add('document-field--dragged-over')
  }
  function dragLeaveHandler(e) {
    e.preventDefault()
    dragCount--
    if (dragCount === 0) {
      e.currentTarget.classList.remove('document-field--dragged-over')
    }
  }
  function dragOverHandler(e) {
    e.preventDefault()
    if (e.currentTarget === draggingElement) return
    if (e.dataTransfer.types.includes('Files')) {
      return
    }
    e.currentTarget.classList.add('document-field--dragged-over')
  }
  function dragEndHandler(e) {
    e.preventDefault()
    e.currentTarget.classList.remove('document-field--dragged-over')
    e.currentTarget.classList.remove('document-field--dragging')
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
    const from = Number(draggingElement.dataset.order)
    const to = Number(e.currentTarget.dataset.order)
    e.currentTarget.classList.remove('document-field--dragging', 'document-field--dragged-over')
    if (to === from) { return }
    const fieldData = [...orderedFields]
    fieldData.splice(to, 0, fieldData.splice(from, 1)[0])
    setOrderedFields(fieldData)
    setDraggingElement(null)
    // Trigger action with documentId, fieldId
    updateFieldOrder(documentId, fieldIdToUpdate, to)
    // Reset drag count
    dragCount = 0
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
      creating={creating}
      createdFieldId={createdFieldId}
      dragStartHandler={dragStartHandler}
      dragEndHandler={dragEndHandler}
      dragEnterHandler={dragEnterHandler}
      dragLeaveHandler={dragLeaveHandler}
      dragOverHandler={dragOverHandler}
      dropHandler={dropHandler}
      fields={orderedFields}
      fieldChangeHandler={debouncedValueChangeHandler}
      fieldRenameHandler={debouncedNameChangeHandler}
      fieldDestroyHandler={fieldDestroyHandler}
      isPublishing={isPublishing} />
  )
}

DocumentFieldsContainer.propTypes = {
  creating: PropTypes.bool.isRequired,
  createdFieldId: PropTypes.number,
  isPublishing: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  removeField: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  updateFieldOrder: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    creating: state.ui.fields.creating,
    createdFieldId: state.documentFields.lastCreatedFieldId,
    isPublishing: state.ui.documents.isPublishing
  }
}

const mapDispatchToProps = { removeField, updateField, updateFieldOrder, uiConfirm }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentFieldsContainer)
)
