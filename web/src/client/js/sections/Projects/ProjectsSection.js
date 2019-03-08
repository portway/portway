import React from 'react'

import Header from 'Components/Header/Header'
import ProjectsListContainer from 'Components/ProjectsList/ProjectsListContainer'

class ProjectsContainer extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Header />
        <div role="main">
          <ProjectsListContainer />
        </div>
      </React.Fragment>
    )
  }
}

export default ProjectsContainer
