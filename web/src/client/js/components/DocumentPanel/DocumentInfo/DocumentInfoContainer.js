import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { debounce } from 'Shared/utilities'
import currentResource from 'Libs/currentResource'
import useDataService from 'Hooks/useDataService'
import { updateDocument } from 'Actions/document'

import DocumentInfoComponent from './DocumentInfoComponent'

const DocumentInfoContainer = ({ updateDocument }) => {
  const { projectId, documentId } = useParams()
  const location = useLocation()

  const { data: currentDocument } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  const debouncedDocumentChangeHandler = debounce(1000, (value) => {
    if (value === '') return
    updateDocument(projectId, documentId, {
      slug: value
    })
  })

  return (
    <DocumentInfoComponent
      document={currentDocument}
      documentChangeHandler={debouncedDocumentChangeHandler}
    />
  )
}

DocumentInfoContainer.propTypes = {
  updateDocument: PropTypes.func.isRequired,
}

const mapDisatchToProps = {
  updateDocument
}

export default connect(null, mapDisatchToProps)(DocumentInfoContainer)
