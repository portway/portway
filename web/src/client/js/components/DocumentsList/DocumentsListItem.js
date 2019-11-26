import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import cx from 'classnames'

import Constants from 'Shared/constants'
import { MoreIcon, TimeIcon } from 'Components/Icons'
import { DropdownItem, DropdownComponent } from 'Components/Dropdown/Dropdown'

const DocumentsListItem = ({
  disable,
  disableDragging,
  document,
  fieldCopyHandler,
  fieldMoveHandler,
  removeDocumentHandler,
  unpublishDocumentHandler,
}) => {
  const [draggedOver, setDraggedOver] = useState(false)

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

  const dropdownButton = {
    className: 'btn btn--blank btn--with-circular-icon',
    icon: <MoreIcon />
  }

  const documentClasses = cx({
    'documents-list__item': true,
    'documents-list__item--active': draggedOver
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
        to={`${Constants.PATH_PROJECT}/${document.projectId}${Constants.PATH_DOCUMENT}/${document.id}`}
        className="btn btn--blank documents-list__button"
        onClick={(e) => { if (disable) { e.preventDefault() } }}
      >
        <div className="documents-list__name-container">
          <span className="documents-list__name">{ document.name }</span>
          <time className="documents-list__date" dateTime={document.updatedAt}>
            <TimeIcon width="13" height="13" />
            <span>{moment(document.updatedAt).fromNow()}</span>
          </time>
        </div>
        <DropdownComponent align="right" button={dropdownButton} className="documents-list__document-dropdown">
          <DropdownItem label="Unpublish document..." disabled={document.lastPublishedAt === null} type="button" onClick={(e) => {
            e.preventDefault()
            unpublishDocumentHandler(document)
          }} />
          <DropdownItem label="Delete document..." type="button" className="btn--danger" divider onClick={(e) => {
            e.preventDefault()
            removeDocumentHandler(document)
          }} />
        </DropdownComponent>
      </NavLink>
    </li>
  )
}

DocumentsListItem.propTypes = {
  disable: PropTypes.bool.isRequired,
  disableDragging: PropTypes.bool.isRequired,
  document: PropTypes.object.isRequired,
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
    projectId: null,
    createdAt: '',
    updatedAt: ''
  }
}

export default DocumentsListItem
