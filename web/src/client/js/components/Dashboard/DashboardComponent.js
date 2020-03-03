import React from 'react'
import PropTypes from 'prop-types'

import ProjectsListComponent from 'Components/ProjectsList/ProjectListComponent'

const DashboardComponent = ({ history, deleteHandler, loading, projects }) => {
  return (
    <div className="dashboard">
      <ProjectsListComponent
        history={history}
        deleteHandler={deleteHandler}
        loading={loading}
        projects={projects}
      />
    </div>
  )
}

DashboardComponent.propTypes = {
  deleteHandler: PropTypes.func.isRequired,
  history: PropTypes.object,
  loading: PropTypes.bool,
  projects: PropTypes.object.isRequired
}

export default DashboardComponent
