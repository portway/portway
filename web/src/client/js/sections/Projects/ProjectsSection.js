import React from 'react'

import HeaderContainer from 'Components/Header/HeaderContainer'
import ProjectsListContainer from 'Components/ProjectsList/ProjectsListContainer'

class ProjectsContainer extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <HeaderContainer />
        <div role="main">
          <ProjectsListContainer />
        </div>
      </React.Fragment>
    )
  }
}

export default ProjectsContainer
