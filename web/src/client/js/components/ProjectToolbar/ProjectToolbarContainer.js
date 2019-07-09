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
  const { data: projectUsers, loading: assigneesLoading } = useDataService(dataMapper.projects.projectUsers(projectId), [projectId])
  const { data: users, loading: userLoading } = useDataService(dataMapper.users.list(1))

  // Create a list of projectUsers if we have any
  let projectUsersWithoutMe = []
  const myUserId = String(currentUserId)

  if (!userLoading && !assigneesLoading && projectUsers) {
    projectUsersWithoutMe = Object.keys(projectUsers).filter((userId) => {
      if (userId !== myUserId) {
        return users[userId]
      }
    })
  }

  return <ProjectToolbarComponent document={document} projectId={projectId} projectUsers={projectUsersWithoutMe} />
}

ProjectToolbarContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(ProjectToolbarContainer)
