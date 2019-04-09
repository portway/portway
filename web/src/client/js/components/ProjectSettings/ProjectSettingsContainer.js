import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import ProjectSettingsComponent from './ProjectSettingsComponent'

const ProjectSettingsContainer = ({ match, location }) => {
  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])
  const updateHandler = (type, event) => {
    console.info(type, event)
  }
  return (
    <ProjectSettingsComponent
      projectId={match.params.projectId}
      project={project}
      projectUpdateHandler={updateHandler}
      setting={match.params.setting} />
  )
}

ProjectSettingsContainer.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(ProjectSettingsContainer)
