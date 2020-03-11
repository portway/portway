import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import * as strings from 'Loc/strings'
import { uiConfirm } from 'Actions/ui'
import { removeProject, sortProjects } from 'Actions/project'
import ProjectsListComponent from './ProjectListComponent'
import { QUERY_PARAMS } from 'Shared/constants'

const ProjectsListContainer = ({ removeProject, uiConfirm }) => {
  const { sortBy, sortMethod } = useParams()
  const page = 1

  const { data: { projects }, loading } = useDataService(dataMapper.projects.list(page, sortBy, sortMethod), [sortBy, sortMethod])

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

  function sortProjectsHandler(selectedSortProperty) {
    let newSortMethod
    if (sortBy === selectedSortProperty && sortMethod === QUERY_PARAMS.ASCENDING) {
      newSortMethod = QUERY_PARAMS.DESCENDING
    } else {
      newSortMethod = QUERY_PARAMS.ASCENDING
    }

    history.push({
      search: `?sortBy=${selectedSortProperty}&sortMethod=${newSortMethod}&page=${page}`
    })
    sortProjects(sortBy, sortMethod)
  }

  return (
    <div className="project-list-container">
      <ProjectsListComponent
        projects={projects}
        deleteHandler={handleDelete}
        sortProjectsHandler={sortProjectsHandler}
        loading={loading}
        sortBy={sortBy}
        sortMethod={sortMethod}/>
    </div>
  )
}

ProjectsListContainer.propTypes = {
  removeProject: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired
}

const mapStateToProps = () => {
  return {}
}
const mapDispatchToProps = { removeProject, uiConfirm }

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsListContainer)
