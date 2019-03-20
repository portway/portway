import React from 'react'
import { Link } from 'react-router-dom'

import Constants from 'Shared/constants'
import ProjectsListContainer from 'Components/ProjectsList/ProjectsListContainer'

class DashboardSection extends React.PureComponent {
  render() {
    return (
      <div role="main">
        <div className="section">
          <h1>FIRST NAME’s Projects</h1>
          <Link to={Constants.PATH_PROJECTS} className="btn btn--blank">
            All projects
          </Link>
          <ProjectsListContainer />
        </div>
      </div>
    )
  }
}

export default DashboardSection
