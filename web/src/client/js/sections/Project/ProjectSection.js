import React from 'react'

import ProjectContainer from 'Components/Project/ProjectContainer'

class ProjectSection extends React.PureComponent {
  render() {
    return (
      <div role="main">
        <div className="section">
          <ProjectContainer />
        </div>
      </div>
    )
  }
}

export default ProjectSection
