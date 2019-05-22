import React from 'react'
import { Link } from 'react-router-dom'

import { PATH_PROJECTS } from 'Shared/constants'
import SimpleProjectListContainer from 'Components/SimpleProjectList/SimpleProjectListContainer'

class AdminSection extends React.PureComponent {
  render() {
    return (
      <main>
        <div className="section">
          <h2>My Projects</h2>
          <SimpleProjectListContainer />
          <Link to={PATH_PROJECTS} className="btn btn--blank">
            See all projects...
          </Link>
        </div>
      </main>
    )
  }
}

export default AdminSection
