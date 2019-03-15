import React from 'react'
import { Link } from 'react-router-dom'

import Constants from 'Shared/constants'
import HeaderContainer from 'Components/Header/HeaderContainer'
import ProjectsListContainer from 'Components/ProjectsList/ProjectsListContainer'

class ProjectsContainer extends React.PureComponent {
  render() {
    return (
      <>
        <HeaderContainer />
        <div role="main">
          <Link
            to={Constants.PATH_PROJECT_CREATE}
            className="btn btn--blank btn--with-circular-icon">
            <span className="icon icon-add" /> New
          </Link>
          <ProjectsListContainer />
        </div>
      </>
    )
  }
}

export default ProjectsContainer
