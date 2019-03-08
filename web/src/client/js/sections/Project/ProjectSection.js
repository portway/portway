import React from 'react'

import Header from 'Components/Header/Header'
import ProjectContainer from 'Components/Project/ProjectContainer'

class ProjectSection extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Header />
        <div role="main">
          <div className="scroll-container section">
            <ProjectContainer />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ProjectSection
