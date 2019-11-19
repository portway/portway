import React, { useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cx from 'classnames'

import { PATH_PROJECT, PATH_DOCUMENT } from 'Shared/constants'

import ProjectToolbarContainer from 'Components/ProjectToolbar/ProjectToolbarContainer'
import DocumentsListContainer from 'Components/DocumentsList/DocumentsListContainer'
import ContentMenuContainer from 'Components/ContentMenu/ContentMenuContainer'
import DocumentContainer from 'Components/Document/DocumentContainer'

const Project = ({ isFullScreen }) => {
  const isDocumentList = useRouteMatch(`${PATH_PROJECT}/:projectId`)
  const isDocumentView = useRouteMatch(`${PATH_PROJECT}/:projectId${PATH_DOCUMENT}/:documentId`)
  const listClasses = cx({
    'project__documents-list-container': true,
    'project__documents-list-container--list-only': isDocumentList && isDocumentList.isExact,
    'project__documents-list-container--document-only': isDocumentView && isDocumentView.isExact,
  })
  const documentsClasses = cx({
    'project__document-container': true,
    'project__document-container--list-only': isDocumentList && isDocumentList.isExact,
    'project__document-container--document-only': isDocumentView && isDocumentView.isExact,
    'project__document-container--full-screen': isFullScreen
  })

  useEffect(() => {
    function bodyDragHandler(e) {
      e.preventDefault()
      return false
    }
    window.addEventListener('dragover', bodyDragHandler, false)
    window.addEventListener('ondrop', bodyDragHandler, false)
    return function cleanup() {
      window.removeEventListener('dragover', bodyDragHandler, false)
      window.removeEventListener('ondrop', bodyDragHandler, false)
    }
  })

  return (
    <main className="project">
      <>
        {!isFullScreen &&
        <div className={listClasses}>
          <DocumentsListContainer />
          <ProjectToolbarContainer />
        </div>
        }
        <div className={documentsClasses}>
          <DocumentContainer />
          <ContentMenuContainer />
        </div>
      </>
    </main>
  )
}

Project.propTypes = {
  isFullScreen: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => {
  return {
    isFullScreen: state.ui.document.isFullScreen
  }
}

export default connect(mapStateToProps)(Project)
