import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

import { getNewNameInSequence } from 'Shared/utilities'
import { FIELD_TYPES } from 'Shared/constants'

import {
  createField,
  createNewFieldWithTheSplitOfThePreviousFieldAndReOrderThemAppropriately,
} from 'Actions/field'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import ContentMenuComponent from './ContentMenuComponent'

const ContentMenuContainer = ({
  createField,
  createNewFieldWithTheSplitOfThePreviousFieldAndReOrderThemAppropriately,
  fields,
  focusedField
}) => {
  const location = useLocation()
  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])
  const { data: document } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  if (!project || !document) return null

  function fieldCreationHandler(fieldType) {
    if (fields && focusedField && fields[focusedField.id] && focusedField.type === FIELD_TYPES.TEXT) {
      // If we have a focused textfield, split the textfield and insert the field in the middle
      const editor = focusedField.data
      const newFieldName = getNewNameInSequence(fields, fieldType)
      const newSplitTextName = getNewNameInSequence(fields, FIELD_TYPES.TEXT)

      // The current order of the field we're splitting
      const fieldWithCursorOrder = fields[focusedField.id].order

      createNewFieldWithTheSplitOfThePreviousFieldAndReOrderThemAppropriately(document.id, focusedField.id, editor, fieldWithCursorOrder, newFieldName, fieldType, newSplitTextName)
    } else {
      const newName = getNewNameInSequence(fields, fieldType)
      createField(project.id, document.id, fieldType, { name: newName, type: fieldType })
    }
  }

  return <ContentMenuComponent createFieldHandler={fieldCreationHandler} />
}

ContentMenuContainer.propTypes = {
  createField: PropTypes.func.isRequired,
  createNewFieldWithTheSplitOfThePreviousFieldAndReOrderThemAppropriately: PropTypes.func.isRequired,
  fields: PropTypes.object,
  focusedField: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.number,
    data: PropTypes.object,
  }),
}

const mapStateToProps = (state) => {
  return {
    fields: state.documentFields.documentFieldsById[state.documents.currentDocumentId],
    focusedField: state.documentFields.focused
  }
}

const mapDispatchToProps = {
  createField,
  createNewFieldWithTheSplitOfThePreviousFieldAndReOrderThemAppropriately
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentMenuContainer)
