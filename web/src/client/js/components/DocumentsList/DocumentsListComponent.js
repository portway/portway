import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { AddIcon } from 'Components/Icons'
import ToolbarComponent from 'Components/Toolbar/ToolbarComponent'
import DocumentsListItem from './DocumentsListItem'
import { RemoveIcon } from 'Components/Icons'
import './DocumentsList.scss'

const DocumentsListComponent = ({ creating, createCallback, documents }) => {
  // Set up toolbar
  const toolbarAction = {
    callback: () => { createCallback(true) },
    icon: <AddIcon width="16" height="16" />,
    label: `New Document`,
    title: 'Create a new document in this project'
  }

  function renderNewDocument() {
    if (creating) {
      return (
        <li className="documents-list__item documents-list__item--new">
          <div className="documents-list__button">
            <span className="documents-list__name">New document</span>
            <button
              className="btn btn--blank btn--with-circular-icon"
              onClick={() => { createCallback(false) }}>
              <RemoveIcon width="18" height="18" />
            </button>
          </div>
        </li>
      )
    }
  }

  function renderDocumentsList() {
    return Object.keys(documents).map((key, index) => {
      return <DocumentsListItem key={`d-${key}-${index}`} document={documents[key]} />
    })
  }

  const classes = cx({
    'documents-list': true,
    'documents-list--creating': creating
  })

  return (
    <div className={classes}>
      <ToolbarComponent action={toolbarAction} filter sort />
      <nav>
        <ol className="documents-list__list">
          {renderNewDocument()}
          {renderDocumentsList()}
        </ol>
      </nav>
    </div>
  )
}

DocumentsListComponent.propTypes = {
  creating: PropTypes.bool.isRequired,
  createCallback: PropTypes.func.isRequired,
  documents: PropTypes.object.isRequired
}

DocumentsListComponent.defaultProps = {
  projectName: '',
  documents: {}
}

export default DocumentsListComponent
