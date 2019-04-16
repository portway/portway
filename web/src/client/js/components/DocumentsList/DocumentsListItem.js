import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import moment from 'moment'

import Constants from 'Shared/constants'
import { TimeIcon } from 'Components/Icons'

const DocumentsListItem = ({ disable, document }) => {
  return (
    <li className="documents-list__item">
      <NavLink
        to={`${Constants.PATH_PROJECT}/${document.projectId}${Constants.PATH_DOCUMENT}/${
          document.id
        }`}
        className="btn btn--blank documents-list__button"
        onClick={(e) => {
          if (disable) {
            e.preventDefault()
          }
        }}>
        <span className="documents-list__name">{document.name}</span>
        <time className="documents-list__date" dateTime={document.updatedAt}>
          <TimeIcon />
          <span>{moment(document.updatedAt).fromNow()}</span>
        </time>
      </NavLink>
    </li>
  )
}

DocumentsListItem.propTypes = {
  disable: PropTypes.bool.isRequired,
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
