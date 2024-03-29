import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import * as strings from 'Loc/strings'
import { MULTI_USER_PLAN_TYPES, ORG_SUBSCRIPTION_STATUS } from 'Shared/constants'
import { currentOrgId } from 'Libs/currentIds'
import { uiConfirm } from 'Actions/ui'
import { removeProject, sortProjects } from 'Actions/project'
import { QUERY_PARAMS } from 'Shared/constants'
import { parseParams } from 'Utilities/queryParams'

import DashboardComponent from './DashboardComponent'

const DashboardContainer = ({ organizationData, removeProject, uiConfirm, sortProjects }) => {
  const params = parseParams(location.search)
  const { page = 1, sortBy = 'updatedAt', sortMethod = QUERY_PARAMS.DESCENDING } = params

  useEffect(() => {
    sortProjects(sortBy, sortMethod)
  }, [sortBy, sortMethod, sortProjects])

  // do an initial sort
  useEffect(() => {
    sortProjects(sortBy, sortMethod)
  }, [])

  const { data: { projects }, loading } = useDataService(dataMapper.projects.list(page, sortBy, sortMethod), [sortBy, sortMethod])
  const { data: organization } = useDataService(dataMapper.organizations.current())
  const history = useHistory()
  const showTeams = MULTI_USER_PLAN_TYPES.includes(organization.plan) && organization.subscriptionStatus === ORG_SUBSCRIPTION_STATUS.ACTIVE

  // Special project
  const specialProjectId = organizationData[currentOrgId].specialProjectId
  const specialProject = projects.find(project => project.id === specialProjectId)
  const projectsForList = projects.filter(project => project.id !== specialProjectId)

  const handleDelete = (projectId) => {
    const project = projects.find(project => project.id === projectId)
    const message = (
      <>
        <p className="danger">{strings.DELETE_PROJECT_TITLE}</p>
        <p>{strings.DELETE_PROJECT_DESCRIPTION}</p>
      </>
    )
    const options = {
      confirmedAction: () => { removeProject(projectId, history) },
      confirmedLabel: strings.DELETE_PROJECT_BUTTON_LABEL,
      confirmedText: project.name,
      theme: 'danger',
    }
    uiConfirm({ message, options })
  }

  const sortProjectsHandler = (selectedSortProperty) => {
    let newSortMethod
    if (sortBy === selectedSortProperty && sortMethod === QUERY_PARAMS.ASCENDING) {
      newSortMethod = QUERY_PARAMS.DESCENDING
    } else {
      newSortMethod = QUERY_PARAMS.ASCENDING
    }

    history.push({
      search: `?sortBy=${selectedSortProperty}&sortMethod=${newSortMethod}&page=${page}`
    })
  }

  return (
    <DashboardComponent
      deleteHandler={handleDelete}
      loading={loading}
      projects={projectsForList}
      showTeams={showTeams}
      specialProject={specialProject}
      sortProjectsHandler={sortProjectsHandler}
      sortBy={sortBy}
      sortMethod={sortMethod}
    />
  )
}

DashboardContainer.propTypes = {
  organizationData: PropTypes.object.isRequired,
  removeProject: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired,
  sortProjects: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    organizationData: state.organizations.organizationSpecialDataById,
  }
}
const mapDispatchToProps = { removeProject, uiConfirm, sortProjects }

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer)
