import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { updateDocument } from 'Actions/document'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import { debounce } from 'Shared/utilities'
import DocumentComponent from './DocumentComponent'

const DocumentContainer = ({ location, ui, updateDocument }) => {
  const { data: document } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  /**
   * If we're creating a document, render nothing
   */
  if (ui.documents.creating) {
    return null
  }

  /**
   * If there is no document and we are not creating: true, then we render
   * a helpful message
   */
  if (!document) {
    return <div>No document</div>
  }

  /**
   * Otherwise we rendre the document, and update its values onChange
   */
  const nameChangeAction = debounce(1000, (e) => {
    if (e.target.value !== document.name) {
      updateDocument(document.id, document.projectId, {
        name: e.target.value,
        projectId: document.projectId
      })
    }
  })
  function nameChangeHandler(e) {
    e.persist()
    nameChangeAction(e)
  }
  return <DocumentComponent
    nameChangeHandler={nameChangeHandler}
    document={document} />
}

DocumentContainer.propTypes = {
  location: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  updateDocument: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui
  }
}

const mapDispatchToProps = {
  updateDocument
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentContainer)
)
