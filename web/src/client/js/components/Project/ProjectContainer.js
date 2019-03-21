import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import useDataService from '../../hooks/useDataService'
import currentResource from '../../libs/currentResource'

const ProjectContainer = ({ location }) => {
  const { data: project } = useDataService(
    currentResource('project', location.pathname), [location.pathname]
  )

  return (
    <div className="project">
      <h3>{project ? project.name : null}</h3>
      <h4>Description:</h4>
      <div>{project ? project.description : null}</div>
    </div>
  )
}

ProjectContainer.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(ProjectContainer)
