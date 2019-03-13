import React from 'react'

import ProjectsListContainer from 'Components/ProjectsList/ProjectsListContainer'

class DashboardSection extends React.PureComponent {
  render() {
    return (
      <div role="main">
        <div className="scroll-container section">
          <h1>Dashboard</h1>
          <ProjectsListContainer />
        </div>
      </div>
    )
  }
}

export default DashboardSection
