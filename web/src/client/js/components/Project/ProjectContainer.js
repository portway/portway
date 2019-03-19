import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import useDataService from '../../hooks/useDataService'
import dataMapper from '../../libs/dataMapper'
import { removeProject } from 'Actions/project'

const ProjectContainer = ({ match, dispatch }) => {
  const { data: project } = useDataService(dataMapper.projects.id(match.params.projectId), [
    match.params.projectId
  ])

  const handleDelete = function(e) {
    e.preventDefault()
    dispatch(removeProject(project.id))
  }

  return (
    <div className="project">
      <h3>{project ? project.name : null}</h3>
      <h4>Description:</h4>
      <div>{project ? project.description : null}</div>
      <button onClick={handleDelete}>delete</button>
    </div>
  )
}

ProjectContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default connect()(withRouter(ProjectContainer))
