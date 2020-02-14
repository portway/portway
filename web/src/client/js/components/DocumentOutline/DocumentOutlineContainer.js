import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { DOCUMENT_MODE, FIELD_TYPES } from 'Shared/constants'
import { debounce, isAnyPartOfElementInViewport } from 'Shared/utilities'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import { uiConfirm, uiToggleDocumentMode } from 'Actions/ui'
import { removeField, updateField, updateFieldOrder } from 'Actions/field'

import DocumentOutlineComponent from './DocumentOutlineComponent'

const DocumentOutlineContainer = ({
  documentMode,
  fieldsUpdating,
  removeField,
  uiConfirm,
  uiToggleDocumentMode,
  updateField,
  updateFieldOrder
}) => {
  const { projectId, documentId } = useParams()
  const [orderedFields, setOrderedFields] = useState([])
  const [dropped, setDropped] = useState(false)
  const draggingElement = useRef(null)
  const { data: fields = {} } = useDataService(dataMapper.fields.list(documentId), [documentId])

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

  const notReadOnlyModeButDontDoDragEvents = documentMode === DOCUMENT_MODE.NORMAL

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

  let cloneElement
  function dragStartHandler(e) {
    // console.info('drag start')
    e.stopPropagation()
    if (notReadOnlyModeButDontDoDragEvents) return
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
    cloneElement.classList.add('document-outline__clone-element')
    cloneElement.setAttribute('draggable', false)
    cloneElement.setAttribute('id', 'clone-element')
    document.body.appendChild(cloneElement)

    // Make the default, blurry image of the dragged item disappear
    e.dataTransfer.setDragImage(cloneElement, 10, 10)

    setTimeout(() => {
      listItem.classList.add('document-outline__list-item--dragging')
    }, 200)
  }

  function dragEnterHandler(e) {
    // console.info('drag enter', draggingElement)
    e.preventDefault()
    e.stopPropagation()
    if (notReadOnlyModeButDontDoDragEvents) return
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
    if (notReadOnlyModeButDontDoDragEvents) return
    if (e.dataTransfer.types.includes('Files')) {
      return
    }
    const fieldIdToUpdate = draggingElement.current.dataset.id
    const to = Number(draggingElement.current.dataset.order)
    draggingElement.current.classList.remove('document-outline__list-item--dragging')
    // Trigger action with documentId, fieldId
    updateFieldOrder(projectId, documentId, fieldIdToUpdate, to)
  }

  function dragEndHandler(e) {
    // console.info('drag end', draggingElement)
    e.preventDefault()
    e.stopPropagation()
    if (notReadOnlyModeButDontDoDragEvents) return
    draggingElement.current.classList.remove('document-outline__list-item--dragging')
    document.querySelector('#clone-element').remove()

    draggingElement.current = null
    setDropped(!dropped)
  }

  const debouncedNameChangeHandler = debounce(1000, (fieldId, value) => {
    if (value === '') return
    updateField(projectId, documentId, fieldId, { name: value })
  })

  function toggleDocumentMode(e) {
    const mode = documentMode === DOCUMENT_MODE.NORMAL ? DOCUMENT_MODE.EDIT : DOCUMENT_MODE.NORMAL
    uiToggleDocumentMode(mode)
  }

  return (
    <DocumentOutlineComponent
      dragEndHandler={dragEndHandler}
      dragEnterHandler={dragEnterHandler}
      dragLeaveHandler={dragLeaveHandler}
      dragStartHandler={dragStartHandler}
      dropHandler={dropHandler}
      fields={orderedFields}
      fieldsUpdating={fieldsUpdating}
      fieldDestroyHandler={fieldDestroyHandler}
      fieldRenameHandler={debouncedNameChangeHandler}
      toggleDocumentModeHandler={toggleDocumentMode}
    />
  )
}

DocumentOutlineContainer.propTypes = {
  documentMode: PropTypes.string,
  fieldsUpdating: PropTypes.object,
  removeField: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired,
  uiToggleDocumentMode: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  updateFieldOrder: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    documentMode: state.ui.document.documentMode,
    fieldsUpdating: state.ui.fields.fieldsUpdating,
  }
}

const mapDisatchToProps = {
  removeField,
  uiConfirm,
  uiToggleDocumentMode,
  updateField,
  updateFieldOrder,
}

export default connect(mapStateToProps, mapDisatchToProps)(DocumentOutlineContainer)
