import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

import { getNewNameInSequence } from 'Shared/utilities'
import { FIELD_TYPES } from 'Shared/constants'

import { createField, updateFieldOrder } from 'Actions/field'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import ContentMenuComponent from './ContentMenuComponent'

const ContentMenuContainer = ({ createField, fields, focusedField, updateFieldOrder }) => {
  const location = useLocation()
  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])
  const { data: document } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  const fieldWithCursorOrder = useRef()
  const textAfterCursor = useRef()

  if (!project || !document) return null

  function fieldCreationHandler(fieldType) {
    // If we have a focused textfield, split the textfield and insert the field in the middle
    if (fields && focusedField && fields[focusedField.id] && focusedField.type === FIELD_TYPES.TEXT) {
      const editor = focusedField.data
      const currLine = editor.getCursor().line
      const currChar = editor.getCursor().ch
      const lastLine = editor.lastLine()
      const lastLineContent = editor.getLine(lastLine)
      // Get the selection of the field after the current cursor pos
      const startRange = { line: currLine, ch: currChar }
      const endRange = { line: lastLine, ch: lastLineContent.length }
      // Save the text after the cursor
      textAfterCursor.current = editor.getRange(startRange, endRange)
      // The current order of the field we're splitting
      fieldWithCursorOrder.current = fields[focusedField.id].order
      editor.replaceRange('', startRange, endRange)
    }

    // Create the field no matter what
    const newName = getNewNameInSequence(fields, fieldType)
    createField(project.id, document.id, fieldType, { name: newName, type: fieldType })

      // Then if we have textAfterCursor, create a new text field directly after it
      .then((createdField) => {
        if (textAfterCursor.current) {
          const splitFieldName = getNewNameInSequence(fields, FIELD_TYPES.TEXT)
          const splitFieldData = {
            name: splitFieldName,
            type: FIELD_TYPES.TEXT,
            value: textAfterCursor.current,
          }

          // Create the split text field and then order both new fields correctly
          createField(project.id, document.id, FIELD_TYPES.TEXT, splitFieldData)
            .then((splitField) => {
              // Order the new field
              updateFieldOrder(project.id, document.id, createdField.id, fieldWithCursorOrder.current + 1)
                .then((newOrder) => {
                  // Order the split field
                  updateFieldOrder(project.id, document.id, splitField.id, newOrder + 1, true)
                  // Reset
                  fieldWithCursorOrder.current = null
                  textAfterCursor.current = null
                })
            })
        }
      })
  }

  return <ContentMenuComponent createFieldHandler={fieldCreationHandler} />
}

ContentMenuContainer.propTypes = {
  createField: PropTypes.func.isRequired,
  fields: PropTypes.object,
  focusedField: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.number,
    data: PropTypes.object,
  }),
  updateFieldOrder: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    fields: state.documentFields.documentFieldsById[state.documents.currentDocumentId],
    focusedField: state.documentFields.focused
  }
}

const mapDispatchToProps = {
  createField,
  updateFieldOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentMenuContainer)
