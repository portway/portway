import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import { uiConfirm } from 'Actions/ui'
import { removeProject } from 'Actions/project'
import ProjectsListComponent from './ProjectListComponent'

const ProjectsListContainer = ({ history, removeProject, uiConfirm }) => {
  const { data: projects } = useDataService(dataMapper.projects.list())
  const handleDelete = (projectId) => {
    const message = (
      <span>Delete this project? <span className="highlight danger">WARNING: This will delete <i>everything</i>!</span></span>
    )
    const confirmedAction = () => { removeProject(projectId, history) }
    const confirmedLabel = 'Yes, delete this project'
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }
  return (
    <div className="project-list-container">
      <ProjectsListComponent projects={projects} deleteHandler={handleDelete} />
    </div>
  )
}

ProjectsListContainer.propTypes = {
  history: PropTypes.object.isRequired,
  removeProject: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired
}

const mapStateToProps = () => {
  return {}
}
const mapDispatchToProps = { removeProject, uiConfirm }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProjectsListContainer)
)
