import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Constants from 'Shared/constants'
import useClickOutside from 'Hooks/useClickOutside'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'
import { AddIcon, RemoveIcon, SearchIcon, DocumentIcon } from 'Components/Icons'
import DocumentsListItem from './DocumentsListItem'
import ProjectPermission from 'Components/Permission/ProjectPermission'

import './_DocumentsList.scss'

const { PROJECT_ROLE_IDS } = Constants
const ALLOWED_FILES = ['text/markdown', 'text/plain']

const DocumentsListComponent = ({
  clearSearchHandler,
  createCallback,
  createChangeHandler,
  creating,
  documents,
  draggedDocumentHandler,
  fieldCopyHandler,
  fieldMoveHandler,
  loading,
  projectId,
  removeDocumentHandler,
  searchDocumentsHandler,
  unpublishDocumentHandler,
}) => {
  // Keep track of how many things being dragged
  let dragCount = 0

  const [isSearching, setIsSearching] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const listItemRef = useRef()
  const nameRef = useRef()

  // Ctrl-n creates a new document
  useKeyboardShortcut('n', () => createCallback(true))

  // Select the contents of the contentEditable div (new document name)
  useEffect(() => {
    if (creating && nameRef.current) {
      nameRef.current.select()
    }
  })

  function createDocument() {
    if (nameRef.current.value !== Constants.LABEL_NEW_DOCUMENT) {
      createChangeHandler(nameRef.current.value)
    } else {
      createCallback(false)
    }
  }
  useClickOutside(
    listItemRef,
    () => { if (creating) { createDocument() } },
    { preventEscapeFunctionality: true }
  )

  function renderNewDocument() {
    if (creating) {
      return (
        <li className="documents-list__item documents-list__item--new" ref={listItemRef}>
          <div className="documents-list__button">
            <textarea
              ref={nameRef}
              className="documents-list__name"
              defaultValue={Constants.LABEL_NEW_DOCUMENT}
              onKeyDown={(e) => {
                if (e.keyCode === 27) {
                  e.preventDefault()
                  createCallback(false)
                }
                if (e.key.toLowerCase() === 'enter') {
                  e.preventDefault()
                  createChangeHandler(e.target.value)
                }
              }} />
            <button
              aria-label="Remove document"
              className="btn btn--blank btn--with-circular-icon"
              onClick={() => { createCallback(false) }}>
              <RemoveIcon />
            </button>
          </div>
        </li>
      )
    }
  }

  function renderDocumentsList() {
    if (documents.length === 0) return null
    return documents.map((doc, index) => {
      return (
        <DocumentsListItem
          disable={creating}
          disableDragging={dragActive}
          document={doc}
          fieldCopyHandler={fieldCopyHandler}
          fieldMoveHandler={fieldMoveHandler}
          key={`d-${doc.id}-${index}`}
          removeDocumentHandler={removeDocumentHandler}
          unpublishDocumentHandler={unpublishDocumentHandler}
        />
      )
    })
  }

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
    'documents-list--creating': creating,
    'documents-list--dragged-over': dragActive
  })

  const colorSurface = getComputedStyle(document.documentElement).getPropertyValue('--theme-surface')

  return (
    <div
      className={classes}
      onDragEnter={dragEnterHandler}
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={dropHandler}>
      <header className="documents-list__header">
        {!isSearching &&
        <>
          <ProjectPermission
            projectId={projectId}
            acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN, PROJECT_ROLE_IDS.CONTRIBUTOR]}>
            <button
              className="btn btn--blank btn--with-circular-icon"
              onClick={() => { createCallback(true) }}
              title="Create a new document in this project"
            >
              <AddIcon /> <span className="label">New Document</span>
            </button>
          </ProjectPermission>
          <button
            className="btn btn--blank btn--with-circular-icon"
            onClick={() => {
              setIsSearching(true)
            }}
          >
            <SearchIcon />
          </button>
        </>
        }
        {isSearching &&
        <>
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
            className="documents-list__search-field"
            onChange={(e) => { searchDocumentsHandler(e.target.value) }}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() === 'escape') {
                setIsSearching(false)
                clearSearchHandler()
              }
            }}
            placeholder="Search documents..."
            type="search"
          />
          <button
            aria-label="Exit document search"
            className="btn btn--blank btn--with-circular-icon"
            onClick={() => { setIsSearching(false); clearSearchHandler() }}
          >
            <RemoveIcon />
          </button>
        </>
        }
      </header>
      {documents.length === 0 && loading === false && !creating &&
      <div className="documents-list__empty-state">
        <div className="documents-list__empty-state-content notice">
          <div className="notice__icon">
            <DocumentIcon fill={colorSurface} width="32" height="32" />
          </div>
          <h2 className="notice__headline">Get started</h2>
          <ProjectPermission projectId={projectId} acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN, PROJECT_ROLE_IDS.CONTRIBUTOR]}>
            <p>Create a new document, or drag a bunch of text documents here to get started.</p>
            <button className="btn btn--small notice__action" onClick={() => { createCallback(true) }}>Create document</button>
          </ProjectPermission>
        </div>
      </div>
      }
      {(documents.length > 0 || creating) &&
      <nav>
        <ol className="documents-list__list">
          {renderNewDocument()}
          {renderDocumentsList()}
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
  createCallback: PropTypes.func.isRequired,
  createChangeHandler: PropTypes.func.isRequired,
  creating: PropTypes.bool.isRequired,
  documents: PropTypes.array.isRequired,
  draggedDocumentHandler: PropTypes.func.isRequired,
  fieldCopyHandler: PropTypes.func.isRequired,
  fieldMoveHandler: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  projectId: PropTypes.number.isRequired,
  removeDocumentHandler: PropTypes.func.isRequired,
  searchDocumentsHandler: PropTypes.func.isRequired,
  unpublishDocumentHandler: PropTypes.func.isRequired,
}

DocumentsListComponent.defaultProps = {
  documents: {},
  loading: true,
}

export default DocumentsListComponent
