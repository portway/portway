import React from 'react'

import Header from 'Components/Header/HeaderContainer'
import ProjectContainer from 'Components/Project/ProjectContainer'

class ProjectSection extends React.PureComponent {
  render() {
    return (
      <>
        <Header />
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
