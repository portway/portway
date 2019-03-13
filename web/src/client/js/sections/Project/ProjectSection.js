import React from 'react'

import HeaderContainer from 'Components/Header/HeaderContainer'
import ProjectContainer from 'Components/Project/ProjectContainer'

class ProjectSection extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <HeaderContainer />
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
