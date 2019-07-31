import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cx from 'classnames'

import ProjectToolbarContainer from 'Components/ProjectToolbar/ProjectToolbarContainer'
import DocumentsListContainer from 'Components/DocumentsList/DocumentsListContainer'
import DocumentContainer from 'Components/Document/DocumentContainer'

const Project = ({ isFullScreen }) => {
  const documentsClasses = cx({
    'project__documents-document-container': true,
    'project__documents-document-container--full-screen': isFullScreen
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
