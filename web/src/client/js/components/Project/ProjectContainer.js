import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import useDataService from '../../hooks/useDataService'
import currentResource from '../../libs/currentResource'
import { removeProject } from 'Actions/project'

const ProjectContainer = ({ history, location, dispatch }) => {
  const { data: project } = useDataService(
    currentResource('project', location.pathname), [location.pathname]
  )

  const handleDelete = function(e) {
    e.preventDefault()
    dispatch(removeProject(project.id, history))
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
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default connect()(withRouter(ProjectContainer))
