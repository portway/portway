import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { uiToggleFullScreen } from 'Actions/ui'
import { updateDocument } from 'Actions/document'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'
import Constants from 'Shared/constants'

import { PRODUCT_NAME, PATH_DOCUMENT_NEW_PARAM } from 'Shared/constants'
import DocumentComponent from './DocumentComponent'

const DocumentContainer = ({
  isCreating,
  isFullScreen,
  location,
  match,
  uiToggleFullScreen,
  updateDocument,
}) => {
  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])
  const { data: document } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  if (!project || !document) return null

  /**
   * If we're creating a document, render nothing
   */
  if (isCreating || match.params.documentId === Constants.PATH_DOCUMENT_NEW_PARAM) {
    return null
  }

  /**
   * If there is no document and we are not creating: true, then we render
   * a helpful message
   */

  if (typeof match.params.documentId === 'undefined' || match.params.documentId === PATH_DOCUMENT_NEW_PARAM) {
    return <div>No document</div>
  }

  /**
   * Otherwise we render the document, and update its values onChange
   */
  function nameChangeHandler(e) {
    if (e.target.value !== document.name) {
      updateDocument(document.projectId, document.id, {
        name: e.target.value
      })
    }
  }

  function toggleFullScreenHandler(e) {
    uiToggleFullScreen(!isFullScreen)
  }

  return (
    <>
      <Helmet>
        <title>{project.name}: {document.name} –– {PRODUCT_NAME}</title>
      </Helmet>

      <DocumentComponent
        document={document}
        isFullScreen={isFullScreen}
        nameChangeHandler={nameChangeHandler}
        toggleFullScreenHandler={toggleFullScreenHandler} />
    </>
  )
}

DocumentContainer.propTypes = {
  fields: PropTypes.object,
  isCreating: PropTypes.bool.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  uiToggleFullScreen: PropTypes.func.isRequired,
  updateDocument: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    fields: state.documentFields[state.documents.currentDocumentId],
    isCreating: state.ui.documents.creating,
    isFullScreen: state.ui.document.isFullScreen
  }
}

const mapDispatchToProps = {
  updateDocument,
  uiToggleFullScreen
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentContainer)
)
