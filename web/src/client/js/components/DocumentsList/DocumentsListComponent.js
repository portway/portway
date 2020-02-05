import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Constants from 'Shared/constants'
import { AddIcon, DocumentIcon } from 'Components/Icons'
import { IconButton } from 'Components/Buttons'

import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

import ProjectPermission from 'Components/Permission/ProjectPermission'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'
import DocumentsListItem from './DocumentsListItem'
import DocumentsListCreateItem from './DocumentsListCreateItem'
import DocumentsListSearchField from './DocumentsListSearchField'

import './_DocumentsList.scss'

const { PROJECT_ROLE_IDS } = Constants
const ALLOWED_FILES = ['text/markdown', 'text/plain']

const DocumentsListComponent = ({
  clearSearchHandler,
  toggleCreateMode,
  createDocumentHandler,
  createMode,
  documents,
  draggedDocumentHandler,
  fieldCopyHandler,
  fieldMoveHandler,
  isCreating,
  isSearching,
  loading,
  readOnly,
  removeDocumentHandler,
  searchDocumentsHandler,
  unpublishDocumentHandler,
}) => {
  // Keep track of how many things being dragged
  let dragCount = 0

  const [dragActive, setDragActive] = useState(false)

  // Ctrl-n creates a new document
  useKeyboardShortcut('n', () => toggleCreateMode(true))

  function dragEnterHandler(e) {
    e.preventDefault()
    if (!e.dataTransfer.types.includes('Files')) {
      return false
    }
    dragCount++
    setDragActive(true)
  }

  function dragLeaveHandler(e) {
    e.preventDefault()
    if (!e.dataTransfer.types.includes('Files')) {
      return false
    }
    dragCount--
    if (dragCount < 0) {
      setDragActive(false)
    }
  }

  function dragOverHandler(e) {
    e.preventDefault()
    if (!e.dataTransfer.types.includes('Files')) {
      return false
    }
    setDragActive(true)
  }

  function dropHandler(e) {
    e.preventDefault()
    if (!e.dataTransfer.types.includes('Files')) {
      return false
    }
    setDragActive(false)
    const dt = e.dataTransfer
    const files = [...dt.files]
    files.forEach((file) => {
      if (!ALLOWED_FILES.includes(file.type)) return
      draggedDocumentHandler(file)
    })
    dragCount = 0
  }

  const classes = cx({
    'documents-list': true,
    'documents-list--creating': createMode,
    'documents-list--dragged-over': dragActive
  })

  return (
    <div
      className={classes}
      onDragEnter={dragEnterHandler}
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={dropHandler}>
      <header className="documents-list__header">
        <DocumentsListSearchField
          clearSearchHandler={clearSearchHandler}
          disabled={createMode}
          searchDocumentsHandler={searchDocumentsHandler}
        />
        <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN, PROJECT_ROLE_IDS.CONTRIBUTOR]}>
          {!createMode &&
          <IconButton
            aria-label="New document"
            disabled={isSearching}
            onClick={() => { toggleCreateMode(true) }}
            title="Create a new document in this project"
          >
            <AddIcon width="14" height="14" />
          </IconButton>
          }
        </ProjectPermission>
      </header>
      {loading &&
      <div className="documents-list__loading-state">
        <SpinnerComponent color="var(--theme-overlay-dark)" />
      </div>
      }
      {documents.length === 0 && loading === false && !createMode && !isSearching &&
      <div className="documents-list__empty-state">
        <div className="documents-list__empty-state-content notice">
          <div className="notice__icon">
            <DocumentIcon fill="var(--theme-surface)" width="32" height="32" />
          </div>
          {readOnly &&
          <>
            <h2 className="notice__headline">An empty project!?</h2>
            <p>Check back later to see your team’s hard work.</p>
          </>
          }
          <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN, PROJECT_ROLE_IDS.CONTRIBUTOR]}>
            <h2 className="notice__headline">Get started</h2>
            <p>Create a new document, or drag a bunch of text documents here to get started.</p>
            <button className="btn btn--small notice__action" name="addDocument" onClick={() => { toggleCreateMode(true) }}>Create document</button>
          </ProjectPermission>
        </div>
      </div>
      }
      {(documents.length > 0 || createMode) &&
      <nav>
        <ol className="documents-list__list">
          <DocumentsListCreateItem
            active={createMode}
            createDocumentHandler={createDocumentHandler}
            isCreating={isCreating}
            toggleCreateMode={toggleCreateMode}
          />
          {documents.map((doc, index) => {
            return (
              <DocumentsListItem
                disable={createMode}
                disableDragging={dragActive}
                document={doc}
                fieldCopyHandler={fieldCopyHandler}
                fieldMoveHandler={fieldMoveHandler}
                key={`d-${doc.id}-${index}`}
                removeDocumentHandler={removeDocumentHandler}
                unpublishDocumentHandler={unpublishDocumentHandler}
              />
            )
          })}
        </ol>
      </nav>
      }
      <div className="documents-list__drag-notice">
        <p className="note">Drag and drop Markdown files here to create new documents for each</p>
      </div>
    </div>
  )
}

DocumentsListComponent.propTypes = {
  clearSearchHandler: PropTypes.func.isRequired,
  toggleCreateMode: PropTypes.func.isRequired,
  createDocumentHandler: PropTypes.func.isRequired,
  createMode: PropTypes.bool.isRequired,
  documents: PropTypes.array.isRequired,
  draggedDocumentHandler: PropTypes.func.isRequired,
  fieldCopyHandler: PropTypes.func.isRequired,
  fieldMoveHandler: PropTypes.func.isRequired,
  isCreating: PropTypes.bool.isRequired,
  isSearching: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  readOnly: PropTypes.bool,
  removeDocumentHandler: PropTypes.func.isRequired,
  searchDocumentsHandler: PropTypes.func.isRequired,
  unpublishDocumentHandler: PropTypes.func.isRequired,
}

DocumentsListComponent.defaultProps = {
  documents: {},
  loading: true,
}

export default DocumentsListComponent
