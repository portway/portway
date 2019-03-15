import React from 'react'

import HeaderContainer from 'Components/Header/HeaderContainer'
import ProjectContainer from 'Components/Project/ProjectContainer'

class ProjectSection extends React.PureComponent {
  render() {
    return (
      <>
        <HeaderContainer />
        <div role="main">
          <div className="section">
            <ProjectContainer />
          </div>
        </div>
      </>
    )
  }
}

export default ProjectSection
