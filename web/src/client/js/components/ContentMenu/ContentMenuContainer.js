import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { getNewNameInSequence } from 'Shared/utilities'
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

  function fieldCreationHandler(fieldType) {
    const newName = getNewNameInSequence(fields, fieldType)
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
    fields: state.documentFields.documentFieldsById[state.documents.currentDocumentId]
  }
}

const mapDispatchToProps = {
  createField
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ContentMenuContainer)
)
