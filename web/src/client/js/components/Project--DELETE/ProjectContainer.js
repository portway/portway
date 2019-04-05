import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import ProjectComponent from './ProjectComponent'

const ProjectContainer = ({ location }) => {
  const { data: project } = useDataService(
    currentResource('project', location.pathname), [location.pathname]
  )
  return (
    <ProjectComponent project={project ? project : {}} />
  )
}

ProjectContainer.propTypes = {
  location: PropTypes.object.isRequired
}

export default withRouter(ProjectContainer)
