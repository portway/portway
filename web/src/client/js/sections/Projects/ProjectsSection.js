import React from 'react'

import Header from 'Components/Header/Header'
import ProjectCreator from 'Components/ProjectForm/ProjectCreatorContainer'
import ProjectsListContainer from 'Components/ProjectsList/ProjectsListContainer'

class ProjectsContainer extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Header />
        <div role="main">
          <ProjectCreator />
          <ProjectsListContainer />
        </div>
      </React.Fragment>
    )
  }
}

export default ProjectsContainer
