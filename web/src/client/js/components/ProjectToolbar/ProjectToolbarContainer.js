import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import ProjectToolbarComponent from './ProjectToolbarComponent'
import { currentUserId } from 'Libs/currentIds'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

const ProjectToolbarContainer = ({ match }) => {
  const projectId = match.params.projectId
  const documentId = match.params.documentId
  const { data: document } = useDataService(dataMapper.documents.id(projectId, documentId), [projectId, documentId])
  const { data: projectAssignments, loading: assignmentsLoading } = useDataService(dataMapper.projects.projectAssignments(projectId), [projectId])
  const { data: users, loading: userLoading } = useDataService(dataMapper.users.list(1))

  // Create a list of projectUsers if we have any
  let projectUsers = []
  const myUserId = String(currentUserId)

  if (!userLoading && !assignmentsLoading && projectAssignments) {
    projectUsers = Object.keys(projectAssignments).filter((userId) => {
      if (userId !== myUserId) {
        return users[userId]
      }
    })
  }

  return <ProjectToolbarComponent document={document} projectId={projectId} projectUsers={projectUsers} />
}

ProjectToolbarContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(ProjectToolbarContainer)
