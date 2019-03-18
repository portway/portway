import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import useDataService from '../../hooks/useDataService'
// import dataMapper from '../../libs/dataMapper'
import currentResource from '../../libs/currentResource'

const ProjectContainer = ({ history }) => {
  const { data: project } = useDataService(
    currentResource('project', history.location.pathname), [history.location.pathname]
  )

  return <div className="project">{project ? project.name : null}</div>
}

ProjectContainer.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(ProjectContainer)
