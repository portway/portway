import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { debounce } from 'Shared/utilities'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { uiConfirm } from 'Actions/ui'
import { updateField, removeField } from 'Actions/field'

import DocumentFieldsComponent from './DocumentFieldsComponent'

const DocumentFieldsContainer = ({ creating, match, removeField, updateField, uiConfirm }) => {
  const [orderedFields, setOrderedFields] = useState([])
  const [draggingElement, setDraggingElement] = useState(null)
  const { documentId } = match.params
  const { data: fields } = useDataService(dataMapper.fields.list(match.params.documentId), [match.params.documentId])

  // Convert fields object to a sorted array for rendering
  useEffect(() => {
    if (!fields) return
    const fieldMap = Object.keys(fields).map((fieldId) => {
      return fields[fieldId]
    })
    fieldMap.sort((a, b) => {
      return a.order - b.order
    })
    if (fieldMap.length > 0) {
      setOrderedFields(fieldMap)
    }
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
  function dragStartHandler(e) {
    setDraggingElement(e.currentTarget)
    e.currentTarget.classList.add('field--dragging')
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target)
  }
  function dragEnterHandler(e) {
    e.currentTarget.classList.add('field--dragged-over')
  }
  function dragLeaveHandler(e) {
    e.currentTarget.classList.remove('field--dragged-over')
  }
  function dragOverHandler(e) {
    if (e.preventDefault) {
      e.preventDefault()
    }
    e.dataTransfer.dropEffect = 'move'
    return false
  }
  function dragEndHandler(e) {
    e.currentTarget.classList.remove('field--dragging')
  }
  function dropHandler(e) {
    if (e.stopPropagation) {
      e.stopPropagation()
    }
    const from = Number(draggingElement.dataset.order)
    const to = Number(e.currentTarget.dataset.order)
    e.currentTarget.classList.remove('field--dragging', 'field--dragged-over')
    if (to === from) { return }
    const fieldData = orderedFields
    fieldData.splice(to, 0, fieldData.splice(from, 1)[0])
    setOrderedFields(fieldData)
    setDraggingElement(null)
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
      dragStartHandler={dragStartHandler}
      dragEndHandler={dragEndHandler}
      dragEnterHandler={dragEnterHandler}
      dragLeaveHandler={dragLeaveHandler}
      dragOverHandler={dragOverHandler}
      dropHandler={dropHandler}
      fields={orderedFields}
      fieldChangeHandler={debouncedValueChangeHandler}
      fieldRenameHandler={debouncedNameChangeHandler}
      fieldDestroyHandler={fieldDestroyHandler} />
  )
}

DocumentFieldsContainer.propTypes = {
  creating: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  removeField: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    creating: state.ui.fields.creating
  }
}

const mapDispatchToProps = { removeField, updateField, uiConfirm }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentFieldsContainer)
)
