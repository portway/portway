import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const DocumentsListItem = ({ document }) => {
  return (
    <li className="documents-list__item">
      <p className="documents-list__item__name">{ document.name }</p>
      <time className="documents-list__item__date" dateTime={document.updatedAt}>
        {moment(document.updatedAt).fromNow()}
      </time>
    </li>
  )
}

DocumentsListItem.propTypes = {
  document: PropTypes.object.isRequired
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
