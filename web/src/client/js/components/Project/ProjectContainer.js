import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import useDataService from '../../hooks/useDataService'
import dataMapper from '../../libs/dataMapper'

const ProjectContainer = ({ match }) => {
  const { data: project } = useDataService(dataMapper.project.id(match.params.projectId), [
    match.params.projectId
  ])

  return (
    <div className="project">
      <h3>{project ? project.name : null}</h3>
      <h4>Description:</h4>
      <div>{project ? project.description : null}</div>
    </div>
  )
}

ProjectContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(ProjectContainer)
