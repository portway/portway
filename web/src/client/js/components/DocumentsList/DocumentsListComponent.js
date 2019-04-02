import React from 'react'
import PropTypes from 'prop-types'

import ToolbarComponent from 'Components/Toolbar/ToolbarComponent'
import DocumentsListItem from './DocumentsListItem'
import './DocumentsList.scss'

const DocumentsListComponent = ({ projectName, documents }) => {
  // Set up toolbar
  const toolbarAction = {
    callback: null,
    label: `New Document in ${projectName}`,
    icon: 'icon-add'
  }

  function renderDocumentsList() {
    return documents.map((document, index) => {
      return <DocumentsListItem key={`d-${document.id}-${index}`} document={document} />
    })
  }

  return (
    <div className="documents-list">
      <ToolbarComponent action={toolbarAction} filter sort />
      <nav>
        <ol className="documents-list__list">{renderDocumentsList()}</ol>
      </nav>
    </div>
  )
}

DocumentsListComponent.propTypes = {
  projectName: PropTypes.string.isRequired,
  documents: PropTypes.array.isRequired
}

DocumentsListComponent.defaultProps = {
  projectName: '',
  documents: []
}

export default DocumentsListComponent
