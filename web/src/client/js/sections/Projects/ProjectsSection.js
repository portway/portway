import React from 'react'
import { Link } from 'react-router-dom'

import Constants from 'Shared/constants'
import ProjectsListContainer from 'Components/ProjectsList/ProjectsListContainer'

class ProjectsContainer extends React.PureComponent {
  render() {
    return (
      <div role="main">
        <Link to={Constants.PATH_NEW_PROJECT} className="btn btn--blank btn--with-circular-icon">
          <span className="icon icon-add" /> New
        </Link>
        <ProjectsListContainer />
      </div>
    )
  }
}

export default ProjectsContainer
