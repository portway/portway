import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import * as strings from 'Loc/strings'
import { currentOrgId } from 'Libs/currentIds'
import { uiConfirm } from 'Actions/ui'
import { removeProject } from 'Actions/project'

import DashboardComponent from './DashboardComponent'

const DashboardContainer = ({ organizationData, removeProject, uiConfirm }) => {
  const { data: projects, loading } = useDataService(dataMapper.projects.list())
  const history = useHistory()

  // Special project
  const specialProjectId = organizationData[currentOrgId].specialProjectId
  const specialProject = projects[specialProjectId] ? { ...projects[specialProjectId] } : null
  const projectsForList = { ...projects }
  delete projectsForList[specialProjectId]

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
      deleteHandler={handleDelete}
      loading={loading}
      projects={projectsForList}
      specialProject={specialProject}
    />
  )
}

DashboardContainer.propTypes = {
  organizationData: PropTypes.object.isRequired,
  removeProject: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    organizationData: state.organizations.organizationSpecialDataById
  }
}
const mapDispatchToProps = { removeProject, uiConfirm }

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer)
