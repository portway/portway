import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import * as strings from 'Loc/strings'
import { uiConfirm } from 'Actions/ui'
import { removeProject } from 'Actions/project'

import DashboardComponent from './DashboardComponent'

const DashboardContainer = ({ removeProject, uiConfirm }) => {
  const { data: projects, loading } = useDataService(dataMapper.projects.list())
  const history = useHistory()

  console.log(projects)

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
    <DashboardComponent
      history={history}
      deleteHandler={handleDelete}
      loading={loading}
      projects={projects}
    />
  )
}

DashboardContainer.propTypes = {
  removeProject: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired
}

const mapStateToProps = () => {
  return {}
}
const mapDispatchToProps = { removeProject, uiConfirm }

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer)
