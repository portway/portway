import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as strings from 'Loc/strings'
import { PLAN_TYPES } from 'Shared/constants'
import { currentUserId } from 'Libs/currentIds'

import { deleteDocument, publishDocument, unpublishDocument } from 'Actions/document'
import { uiConfirm } from 'Actions/ui'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'
import dataMapper from 'Libs/dataMapper'

import DocumentToolbarComponent from './DocumentToolbarComponent'

const DocumentToolbarContainer = ({
  deleteDocument,
  documentMode,
  history,
  isCreating,
  isPublishing,
  publishDocument,
  uiConfirm,
  unpublishDocument
}) => {
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

  function removeDocumentHandler() {
    const message = (
      <span>{strings.DELETE_CONFIRMATION_TITLE_PREFIX} <span className="highlight">{document.name}</span> {strings.DELETE_CONFIRMATION_TITLE_SUFFIX}</span>
    )
    const confirmedLabel = strings.DELETE_CONFIRMATION_LABEL
    const confirmedAction = () => { deleteDocument(projectId, document.id, history) }
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }

  function unpublishDocumentHandler() {
    const message = (
      <>
        <p>{strings.UNPUBLISH_CONFIRMATION_TITLE} <span className="highlight">{document.name}</span>?</p>
        <p>{strings.UNPUBLISH_CONFIRMATION_DESCRIPTION}</p>
      </>
    )
    const confirmedLabel = strings.UNPUBLISH_CONFIRMATION_LABEL
    const confirmedAction = () => { unpublishDocument(document.id) }
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }

  return (
    <DocumentToolbarComponent
      document={document}
      documentMode={documentMode}
      isCreating={isCreating}
      isPublishing={isPublishing}
      projectUsers={projectUsers}
      publishDocumentHandler={publishDocumentHandler}
      removeDocumentHandler={removeDocumentHandler}
      unpublishDocumentHandler={unpublishDocumentHandler}
    />
  )
}

DocumentToolbarContainer.propTypes = {
  deleteDocument: PropTypes.func.isRequired,
  documentMode: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  isCreating: PropTypes.bool,
  isPublishing: PropTypes.bool,
  publishDocument: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired,
  unpublishDocument: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    documentMode: state.ui.document.documentMode,
    isCreating: state.ui.documents.creating,
    isPublishing: state.ui.documents.isPublishing,
  }
}

const mapDispatchToProps = { deleteDocument, publishDocument, uiConfirm, unpublishDocument }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentToolbarContainer)
)
