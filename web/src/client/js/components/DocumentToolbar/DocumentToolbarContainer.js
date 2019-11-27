import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { PLAN_TYPES } from 'Shared/constants'
import { currentUserId } from 'Libs/currentIds'
import { publishDocument } from 'Actions/document'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'
import dataMapper from 'Libs/dataMapper'

import DocumentToolbarComponent from './DocumentToolbarComponent'

const DocumentToolbarContainer = ({ isCreating, isPublishing, publishDocument }) => {
  const { projectId } = useParams()
  const location = useLocation()
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())
  const { data: document } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])
  const { data: projectAssignments, loading: assignmentsLoading } = useDataService(dataMapper.projects.projectAssignments(projectId), [projectId])
  const { data: users, loading: userLoading } = useDataService(dataMapper.users.list())

  if (!document) return null

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

  function publishDocumentHandler() {
    publishDocument(document.id)
  }

  return (
    <DocumentToolbarComponent
      document={document}
      isCreating={isCreating}
      isPublishing={isPublishing}
      projectUsers={projectUsers}
      publishDocumentHandler={publishDocumentHandler}
    />
  )
}

DocumentToolbarContainer.propTypes = {
  isCreating: PropTypes.bool,
  isPublishing: PropTypes.bool,
  publishDocument: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    isCreating: state.ui.documents.creating,
    isPublishing: state.ui.documents.isPublishing,
  }
}

const mapDispatchToProps = { publishDocument }

export default connect(mapStateToProps, mapDispatchToProps)(DocumentToolbarContainer)
