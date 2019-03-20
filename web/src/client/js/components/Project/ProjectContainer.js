import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import useDataService from '../../hooks/useDataService'
import currentResource from '../../libs/currentResource'

const ProjectContainer = ({ location }) => {
  const { data: project } = useDataService(
    currentResource('project', location.pathname), [location.pathname]
  )

  return <div className="project">{project ? project.name : null}</div>
}

ProjectContainer.propTypes = {
  location: PropTypes.object.isRequired
}

export default withRouter(ProjectContainer)
