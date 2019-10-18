import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cx from 'classnames'

import ProjectToolbarContainer from 'Components/ProjectToolbar/ProjectToolbarContainer'
import DocumentsListContainer from 'Components/DocumentsList/DocumentsListContainer'
import ContentMenuContainer from 'Components/ContentMenu/ContentMenuContainer'
import DocumentContainer from 'Components/Document/DocumentContainer'

const Project = ({ isFullScreen }) => {
  const documentsClasses = cx({
    'project__documents-document-container': true,
    'project__documents-document-container--full-screen': isFullScreen
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
      <div className="project__documents">
        {!isFullScreen &&
        <div className="project__documents-list-container">
          <DocumentsListContainer />
        </div>
        }
        <div className={documentsClasses}>
          <DocumentContainer />
          <ContentMenuContainer />
        </div>
      </div>
      <ProjectToolbarContainer />
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
