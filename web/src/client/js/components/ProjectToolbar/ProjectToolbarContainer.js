import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { PLAN_TYPES } from 'Shared/constants'
import ProjectToolbarComponent from './ProjectToolbarComponent'
import { currentUserId } from 'Libs/currentIds'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import currentResource from 'Libs/currentResource'

const ProjectToolbarContainer = ({ isFullScreen, match }) => {
  const projectId = match.params.projectId
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())
  const { data: document } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])
  const { data: projectAssignments, loading: assignmentsLoading } = useDataService(dataMapper.projects.projectAssignments(projectId), [projectId])
  const { data: users, loading: userLoading } = useDataService(dataMapper.users.list())

  // Create a list of projectUsers if we have any
  let projectUsers = []
  if (currentOrg.plan === PLAN_TYPES.MULTI_USER) {
    const myUserId = String(currentUserId)
    if (!userLoading && !assignmentsLoading && projectAssignments) {
      projectUsers = Object.keys(projectAssignments).filter((userId) => {
        if (userId !== myUserId) {
          return users[userId]
        }
      })
    }
  }

  return (
    <ProjectToolbarComponent
      document={document}
      isFullScreen={isFullScreen}
      projectId={projectId}
      projectUsers={projectUsers}
    />
  )
}

ProjectToolbarContainer.propTypes = {
  isFullScreen: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    isFullScreen: state.ui.document.isFullScreen
  }
}

export default withRouter(
  connect(mapStateToProps)(ProjectToolbarContainer)
)
