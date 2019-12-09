import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { FIELD_LABELS } from 'Shared/constants'
import { groupBy } from 'Shared/utilities'
import { createField } from 'Actions/field'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import ContentMenuComponent from './ContentMenuComponent'

const ContentMenuContainer = ({ createField, fields, location }) => {
  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])
  const { data: document } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  if (!project || !document) return null

  /**
   * If we have fields, break them up by type for field names
   */
  let fieldsByType

  if (fields) {
    fieldsByType = groupBy(fields, 'type')
  } else {
    fieldsByType = {}
  }

  function fieldCreationHandler(fieldType) {
    const typeFieldsInDocument = fieldsByType[fieldType]
    const value = typeFieldsInDocument ? typeFieldsInDocument.length : 0
    const newName = FIELD_LABELS[fieldType] + (value + 1)
    createField(project.id, document.id, fieldType, {
      name: newName,
      type: fieldType
    })
  }

  return <ContentMenuComponent createFieldHandler={fieldCreationHandler} />
}

ContentMenuContainer.propTypes = {
  createField: PropTypes.func.isRequired,
  fields: PropTypes.object,
  location: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  return {
    fields: state.documentFields[state.documents.currentDocumentId]
  }
}

const mapDispatchToProps = {
  createField
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ContentMenuContainer)
)
