import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import useDataService from '../../hooks/useDataService'
import dataMapper from '../../libs/dataMapper'

import ProjectComponent from './ProjectComponent'

const ProjectContainer = ({ match }) => {
  const { data: project } = useDataService(dataMapper.project.id(match.params.projectId), [
    match.params.projectId
  ])
  return (
    <ProjectComponent project={project} />
  )
}

ProjectContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(ProjectContainer)
