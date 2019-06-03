import React from 'react'
import PropTypes from 'prop-types'

import DocumentsListContainer from 'Components/DocumentsList/DocumentsListContainer'
import DocumentContainer from 'Components/Document/DocumentContainer'

const Project = ({ match }) => {
  return (
    <main className="project">
      <div className="project__documents">
        <div className="project__documents-list-container">
          <DocumentsListContainer />
          <div className="project__utilities">
            <div className="project__utilities-button-pill">
              <button className="btn btn--blank project__utilities-button active">Documents</button>
              <button className="btn btn--blank project__utilities-button">Project Info</button>
            </div>
          </div>
        </div>
        <div className="project__documents-document-container">
          <DocumentContainer />
        </div>
      </div>
    </main>
  )
}

Project.propTypes = {
  match: PropTypes.object
}

export default Project
