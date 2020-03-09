import React from 'react'
import { Link } from 'react-router-dom'

import { ProjectIcon } from 'Components/Icons'
import { PATH_PROJECT_CREATE } from 'Shared/constants'

const DashboardProjectsEmptyState = () => {
  return (
    <div className="project-list__empty-state">
      <div className="notice">
        <div className="notice__icon">
          <ProjectIcon fill="var(--theme-surface)" width="32" height="32" />
        </div>
        <h2 className="notice__header">Create your first project</h2>
        <p>Let’s get you going! Create a project and start adding or importing documents</p>
        <Link to={PATH_PROJECT_CREATE} className="btn">Get started</Link>
      </div>
    </div>
  )
}

export default DashboardProjectsEmptyState
