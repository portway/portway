import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { FIELD_TYPES } from 'Shared/constants'
import { debounce, isAnyPartOfElementInViewport } from 'Shared/utilities'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import currentResource from 'Libs/currentResource'

import { uiConfirm } from 'Actions/ui'
import { selectDocumentField } from 'Actions/documentPanel'
import { removeField, updateField, updateFieldOrder } from 'Actions/field'

import DocumentOutlineComponent from './DocumentOutlineComponent'

const DocumentOutlineContainer = ({
  fieldsUpdating,
  isDocumentPanelOpen,
  removeField,
  selectDocumentField,
  uiConfirm,
  updateField,
  updateFieldOrder
}) => {
  const { projectId, documentId } = useParams()
  const location = useLocation()

  const [orderedFields, setOrderedFields] = useState([])
  const [dropped, setDropped] = useState(false)
  const draggingElement = useRef(null)

  const { data: currentDocument } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])
  const { data: fields = {} } = useDataService(dataMapper.fields.list(documentId), [documentId])

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

  if (!currentDocument) return null

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
    const options = {
      confirmedLabel: 'Yes, delete it.',
      confirmedAction: () => { removeField(projectId, documentId, fieldId) },
      theme: 'danger',
    }
    uiConfirm({ message, options })
  }

  let cloneElement
  function dragStartHandler(e) {
    console.info('drag start')
    e.stopPropagation()
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
      if (draggingElement.current) {
        draggingElement.current.classList.add('document-outline__list-item--dragging')
      }
    }, 100)
  }

  function dragEnterHandler(e) {
    // console.info('drag enter', draggingElement)
    e.preventDefault()
    e.stopPropagation()
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
      if (draggingElement.current && !isAnyPartOfElementInViewport(draggingElement.current)) {
        draggingElement.current.scrollIntoView(false, {
          // behavior: 'smooth'
        })
      }
    })
  }

  // This is here for debugging
  function dragLeaveHandler(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function dropHandler(e) {
    // console.info('drop handler', draggingElement)
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.types.includes('Files')) {
      return
    }
    draggingElement.current.classList.remove('document-outline__list-item--dragging')
  }

  function dragEndHandler(e) {
    // console.info('end handler', draggingElement)
    // console.info('-------------------------------')
    e.preventDefault()
    e.stopPropagation()
    draggingElement.current.classList.remove('document-outline__list-item--dragging')
    const fieldIdToUpdate = draggingElement.current.dataset.id
    const to = Number(draggingElement.current.dataset.order)
    // Trigger action with documentId, fieldId
    updateFieldOrder(documentId, fieldIdToUpdate, to, true)
    // Clean up
    document.querySelector('#clone-element').remove()
    draggingElement.current = null
    setDropped(!dropped)
  }

  function fieldSettingToggleHandler(fieldId) {
    selectDocumentField(fieldId)
  }

  const debouncedNameChangeHandler = debounce(1000, (fieldId, value) => {
    if (value === '') return
    updateField(projectId, documentId, fieldId, { name: value })
  })

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
      fieldSettingToggleHandler={fieldSettingToggleHandler}
    />
  )
}

DocumentOutlineContainer.propTypes = {
  fieldsUpdating: PropTypes.object,
  isDocumentPanelOpen: PropTypes.bool.isRequired,
  removeField: PropTypes.func.isRequired,
  selectDocumentField: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  updateFieldOrder: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    fieldsUpdating: state.ui.fields.fieldsUpdating,
    isDocumentPanelOpen: state.documentPanel.panel.visible,
  }
}

const mapDisatchToProps = {
  removeField,
  selectDocumentField,
  uiConfirm,
  updateField,
  updateFieldOrder,
}

export default connect(mapStateToProps, mapDisatchToProps)(DocumentOutlineContainer)
