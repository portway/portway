import React from 'react'

import HeaderContainer from 'Components/Header/HeaderContainer'
import ProjectsListContainer from 'Components/ProjectsList/ProjectsListContainer'

class DashboardSection extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <HeaderContainer />
        <div role="main">
          <div className="scroll-container section">
            <h1>Dashboard</h1>
            <ProjectsListContainer />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default DashboardSection
