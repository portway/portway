import React, { useEffect, useRef } from 'react'
import { useRouteMatch, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cx from 'classnames'

import { MOBILE_MATCH_SIZE, PATH_PROJECT, PATH_DOCUMENT, PATH_DOCUMENT_NEW_PARAM } from 'Shared/constants'

import ProjectToolbarContainer from 'Components/ProjectToolbar/ProjectToolbarContainer'
import DocumentsListContainer from 'Components/DocumentsList/DocumentsListContainer'
import DocumentPanelContainer from 'Components/DocumentPanel/DocumentPanelContainer'
import DocumentHeaderContainer from 'Components/Document/DocumentHeaderContainer'
import DocumentFieldsContainer from 'Components/DocumentFields/DocumentFieldsContainer'
import DocumentToolbarContainer from 'Components/DocumentToolbar/DocumentToolbarContainer'
import NoProject from 'Components/Pages/NoProject'
import ValidationContainer from 'Components/Validation/ValidationContainer'

const Project = ({ isFullScreen }) => {
  const { documentId, projectId } = useParams()
  const isDocumentList = useRouteMatch(`${PATH_PROJECT}/:projectId`)
  const isCreateDocumentView = useRouteMatch(`${PATH_PROJECT}/:projectId${PATH_DOCUMENT}/${PATH_DOCUMENT_NEW_PARAM}`)
  const isDocumentView = useRouteMatch(`${PATH_PROJECT}/:projectId${PATH_DOCUMENT}/:documentId`)

  // When we are looking at a document list on mobile
  const isMobileListView = isDocumentList && isDocumentList.isExact && window.matchMedia(MOBILE_MATCH_SIZE).matches

  // When we are looking at a document list, and have hit New Document on mobile
  const isMobileCreateView = isCreateDocumentView && isCreateDocumentView.isExact &&
                             documentId === PATH_DOCUMENT_NEW_PARAM && window.matchMedia(MOBILE_MATCH_SIZE).matches

  // When we are really on a document view, on mobile
  const isMobileDocumentView = isDocumentView && isDocumentView.isExact &&
                               documentId !== PATH_DOCUMENT_NEW_PARAM && window.matchMedia(MOBILE_MATCH_SIZE).matches

  const listClasses = cx({
    'project__documents-list-container': true,
    'project__documents-list-container--list-only': isMobileListView || isMobileCreateView,
    'project__documents-list-container--document-only': isMobileDocumentView && !isMobileCreateView,
  })
  const documentsClasses = cx({
    'project__document-container': true,
    'project__document-container--list-only': isMobileListView || isMobileCreateView,
    'project__document-container--document-only': isMobileDocumentView && !isMobileCreateView,
    'project__document-container--full-screen': isFullScreen
  })
  const docKey = documentId || 0
  const documentRef = useRef()

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

  // project id isn't a number, redirect to 404 page
  if (projectId && isNaN(projectId)) {
    return <NoProject />
  }

  return (
    <>
      <main className="project">
        <>
          {!isFullScreen &&
          <div className={listClasses}>
            <DocumentsListContainer />
          </div>
          }
          <div className={documentsClasses}>
            <div className="document" key={docKey} ref={documentRef}>
              <ValidationContainer resource="document" value="name" />
              <DocumentHeaderContainer />
              <DocumentPanelContainer />
              <DocumentFieldsContainer />
            </div>
          </div>
        </>
      </main>
      <footer className="project__footer">
        {!isFullScreen && !isMobileDocumentView &&
        <ProjectToolbarContainer />
        }
        {!isMobileListView &&
        <DocumentToolbarContainer />
        }
      </footer>
    </>
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
