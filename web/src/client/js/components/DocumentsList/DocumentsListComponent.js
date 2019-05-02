import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Constants from 'Shared/constants'
import useClickOutside from 'Hooks/useClickOutside'
import { AddIcon, RemoveIcon } from 'Components/Icons'
import ToolbarComponent from 'Components/Toolbar/ToolbarComponent'
import DocumentsListItem from './DocumentsListItem'
import './DocumentsList.scss'
import ProjectPermission from 'Components/Permission/ProjectPermission'

const { PROJECT_ROLE_IDS } = Constants

const DocumentsListComponent = ({ createChangeHandler, creating, createCallback, documents, projectId }) => {
  const listItemRef = useRef()
  const nameRef = useRef()

  // Select the contents of the contentEditable div (new document name)
  useEffect(() => {
    if (creating && nameRef.current) {
      nameRef.current.select()
    }
  })

  // Set up toolbar
  const toolbarAction = {
    callback: () => { createCallback(true) },
    icon: <AddIcon />,
    label: 'New Document',
    shortcut: 'n',
    title: 'Create a new document in this project'
  }

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
      <ProjectPermission
        projectId={projectId}
        acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN, PROJECT_ROLE_IDS.CONTRIBUTOR]}
        elseRender={(
          <ToolbarComponent action={{}} filter sort />
        )}>
        <ToolbarComponent action={toolbarAction} filter sort />
      </ProjectPermission>
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
  documents: PropTypes.array.isRequired,
  projectId: PropTypes.number.isRequired
}

DocumentsListComponent.defaultProps = {
  documents: {}
}

export default DocumentsListComponent
