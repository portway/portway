import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import useClickOutside from 'Hooks/useClickOutside'
import { AddIcon, RemoveIcon } from 'Components/Icons'
import ToolbarComponent from 'Components/Toolbar/ToolbarComponent'
import DocumentsListItem from './DocumentsListItem'

import './DocumentsList.scss'

const DocumentsListComponent = ({ createChangeHandler, creating, createCallback, documents }) => {
  const nameRef = useRef()

  // Select the contents of the contentEditable div (new document name)
  useEffect(() => {
    if (creating && nameRef.current) {
      const range = document.createRange()
      range.selectNodeContents(nameRef.current)
      const sel = document.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  })

  // Set up toolbar
  const toolbarAction = {
    callback: () => { createCallback(true) },
    icon: <AddIcon width="16" height="16" />,
    label: `New Document`,
    shortcut: 'n',
    title: 'Create a new document in this project'
  }

  useClickOutside(nameRef, () => {
    if (creating) {
      createCallback(false)
    }
  })

  function renderNewDocument() {
    if (creating) {
      return (
        <li className="documents-list__item documents-list__item--new">
          <div className="documents-list__button">
            <div contentEditable
              ref={nameRef}
              role="textbox"
              tabIndex={0}
              className="documents-list__name"
              suppressContentEditableWarning
              onKeyDown={(e) => {
                if (e.key.toLowerCase() === 'enter') {
                  e.preventDefault()
                  createChangeHandler(e)
                }
              }}>New Document</div>
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
    return documents.map((doc, index) => {
      return <DocumentsListItem disable={creating} key={`d-${doc.id}-${index}`} document={doc} />
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
  createChangeHandler: PropTypes.func.isRequired,
  creating: PropTypes.bool.isRequired,
  createCallback: PropTypes.func.isRequired,
  documents: PropTypes.array.isRequired
}

DocumentsListComponent.defaultProps = {
  projectName: '',
  documents: {}
}

export default DocumentsListComponent
