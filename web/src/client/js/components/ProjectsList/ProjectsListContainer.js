import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import * as strings from 'Loc/strings'
import { uiConfirm } from 'Actions/ui'
import { removeProject } from 'Actions/project'
import ProjectsListComponent from './ProjectListComponent'

const ProjectsListContainer = ({ history, removeProject, uiConfirm }) => {
  const { data: projects, loading } = useDataService(dataMapper.projects.list())

  const handleDelete = (projectId) => {
    const message = (
      <>
        <p className="danger">{strings.DELETE_PROJECT_TITLE}</p>
        <p>{strings.DELETE_PROJECT_DESCRIPTION}</p>
      </>
    )
    const options = {
      confirmedAction: () => { removeProject(projectId, history) },
      confirmedLabel: strings.DELETE_PROJECT_BUTTON_LABEL,
      confirmedText: projects[projectId].name,
      theme: 'danger',
    }
    uiConfirm({ message, options })
  }

  return (
    <div className="project-list-container">
      <ProjectsListComponent history={history} projects={projects} deleteHandler={handleDelete} loading={loading} />
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
