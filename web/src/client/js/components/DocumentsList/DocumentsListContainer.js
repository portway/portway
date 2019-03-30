import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import DocumentsListComponent from './DocumentsListComponent'

const DocumentsListContainer = ({ location }) => {
  const { data: project } = useDataService(
    currentResource('project', location.pathname), [location.pathname]
  )
  if (!project) return null
  return (
    <DocumentsListComponent projectName={project.name} />
  )
}

DocumentsListContainer.propTypes = {
  location: PropTypes.object.isRequired
}

export default withRouter(DocumentsListContainer)
