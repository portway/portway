import React, { useCallback, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import cx from 'classnames'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'

import { PATH_PROJECT, PATH_DOCUMENT, PROJECT_ROLE_IDS } from 'Shared/constants'
import ProjectPermission from 'Components/Permission/ProjectPermission'
import { MoreIcon, TimeIcon } from 'Components/Icons'
import { Popper, PopperGroup } from 'Components/Popper/Popper'
import { Menu, MenuItem } from 'Components/Menu'

const DocumentsListItem = ({
  disable,
  disableDragging,
  document,
  duplicateDocumentHandler,
  fieldCopyHandler,
  fieldMoveHandler,
  removeDocumentHandler,
  unpublishDocumentHandler,
}) => {
  const [draggedOver, setDraggedOver] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef()
  const anchorRef = useRef()

  const collapseCallback = useCallback(() => {
    setExpanded(false)
  }, [])

  useClickOutside(containerRef, collapseCallback)
  useBlur(containerRef, collapseCallback)

  function dropHandler(e) {
    e.preventDefault()
    setDraggedOver(false)
    if (!e.dataTransfer.types.includes('fieldid') || !e.dataTransfer.types.includes('documentid')) {
      return
    }
    const fieldId = Number(e.dataTransfer.getData('fieldid'))
    const oldDocumentId = Number(e.dataTransfer.getData('documentid'))
    const thisDocumentId = Number(document.id)
    // If we're copying
    // @todo: Safari bug - dropEffect should be good here on its own
    // https://bugs.webkit.org/show_bug.cgi?id=101853
    if (e.dataTransfer.dropEffect === 'copy' || e.dataTransfer.effectAllowed === 'copy') {
      fieldCopyHandler(oldDocumentId, thisDocumentId, fieldId)
    } else {
      fieldMoveHandler(oldDocumentId, thisDocumentId, fieldId)
    }
  }

  function dragEnterHandler(e) {
    e.persist()
    e.preventDefault()
    if (!e.dataTransfer.types.includes('fieldid')) {
      return false
    }
    setDraggedOver(true)
  }

  function dragLeaveHandler(e) {
    e.preventDefault()
    if (!e.dataTransfer.types.includes('fieldid')) {
      return false
    }
    setDraggedOver(false)
  }

  function dragOverHandler(e) {
    e.preventDefault()
    if (!e.dataTransfer.types.includes('fieldid')) {
      return false
    }
    setDraggedOver(true)
  }

  const documentClasses = cx({
    'documents-list__item': true,
    'documents-list__item--active': draggedOver
  })

  const hasUnpublishedChanges = document.lastPublishedAt ? moment(document.updatedAt).isAfter(document.lastPublishedAt, 'second') : true

  const documentNameClasses = cx({
    'documents-list__name': true,
    'documents-list__name--unpublished': hasUnpublishedChanges
  })

  return (
    <li
      className={documentClasses}
      data-document-id={document.id}
      onDrop={(e) => { disableDragging ? null : dropHandler(e) }}
      onDragEnter={(e) => { disableDragging ? null : dragEnterHandler(e) }}
      onDragLeave={(e) => { disableDragging ? null : dragLeaveHandler(e) }}
      onDragOver={(e) => { disableDragging ? null : dragOverHandler(e) }}>
      <NavLink
        to={`${PATH_PROJECT}/${document.projectId}${PATH_DOCUMENT}/${document.id}`}
        className="btn btn--blank documents-list__button"
        onClick={(e) => { if (disable) { e.preventDefault() } }}
      >
        <div className="documents-list__name-container">
          <span className={documentNameClasses}>{ document.name }</span>
          <time className="documents-list__date" dateTime={document.updatedAt}>
            <TimeIcon width="13" height="13" />
            <span>{moment(document.updatedAt).fromNow()}</span>
            {hasUnpublishedChanges &&
                <span className="documents-list__unpublished-label" title="This document has unpublished changes">Unpublished</span>
            }
          </time>
        </div>
        <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN, PROJECT_ROLE_IDS.CONTRIBUTOR]}>
          <PopperGroup anchorRef={containerRef}>
            <button
              aria-expanded={expanded}
              aria-haspopup="true"
              aria-controls="document-options-menu"
              aria-label="Document options menu"
              className="btn btn--blank btn--with-circular-icon"
              onClick={(e) => {
                e.preventDefault()
                setExpanded(!expanded)
              }}
              ref={anchorRef}
            >
              <MoreIcon />
            </button>
            <Popper
              id="document-options-menu"
              align="right"
              anchorRef={anchorRef}
              autoCollapse={collapseCallback}
              open={expanded}
            >
              <Menu anchorRef={anchorRef}>
                <MenuItem tabIndex="0">
                  <button
                    className="btn btn--blank"
                    onClick={(e) => {
                      e.preventDefault()
                      duplicateDocumentHandler(document.id)
                    }}
                  >
                    Duplicate document
                  </button>
                </MenuItem>
                <MenuItem disabled={document.lastPublishedAt === null} tabIndex="-1">
                  <button
                    className="btn btn--blank"
                    disabled={document.lastPublishedAt === null}
                    onClick={(e) => {
                      e.preventDefault()
                      unpublishDocumentHandler(document)
                    }}
                  >
                    Unpublish document...
                  </button>
                </MenuItem>
                <MenuItem tabIndex="-1">
                  <button
                    className="btn btn--blank btn--danger"
                    onClick={(e) => {
                      e.preventDefault()
                      removeDocumentHandler(document)
                    }}
                  >
                    Delete document...
                  </button>
                </MenuItem>
              </Menu>
            </Popper>
          </PopperGroup>
        </ProjectPermission>
      </NavLink>
    </li>
  )
}

DocumentsListItem.propTypes = {
  disable: PropTypes.bool.isRequired,
  disableDragging: PropTypes.bool.isRequired,
  document: PropTypes.object.isRequired,
  duplicateDocumentHandler: PropTypes.func.isRequired,
  fieldCopyHandler: PropTypes.func.isRequired,
  fieldMoveHandler: PropTypes.func.isRequired,
  removeDocumentHandler: PropTypes.func.isRequired,
  unpublishDocumentHandler: PropTypes.func.isRequired,
}

DocumentsListItem.defaultProps = {
  document: {
    id: null,
    name: '',
    publishedVersionId: null,
    orgId: null,
    createdAt: '',
    updatedAt: ''
  }
}

export default DocumentsListItem
