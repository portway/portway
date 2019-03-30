import React from 'react'
import { Link } from 'react-router-dom'

import Constants from 'Shared/constants'

class DashboardSection extends React.PureComponent {
  render() {
    return (
      <div role="main">
        <div className="section">
          <Link to={Constants.PATH_PROJECTS} className="btn btn--blank">
            See all projects...
          </Link>
        </div>
      </div>
    )
  }
}

export default DashboardSection
