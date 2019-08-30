import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { ProjectIcon } from 'Components/Icons'
import { PATH_PROJECT_CREATE } from 'Shared/constants'
import useClickOutside from 'Hooks/useClickOutside'
import ProjectsListItem from './ProjectsListItem'
import './_ProjectList.scss'

function ProjectsListComponent({ deleteHandler, projects }) {
  const [activeProjectId, setActiveProjectId] = useState(null)

  const nodeRef = useRef()
  const collapseCallback = useCallback(() => {
    setActiveProjectId(null)
  }, [])
  useClickOutside(nodeRef, collapseCallback)

  function projectToggleHandler(projectId) {
    if (projectId === null) {
      setActiveProjectId(null)
      return false
    }
    setActiveProjectId(projectId)
  }

  const projectList = Object.keys(projects).map((projectId) => {
    return <ProjectsListItem
      activeProjectId={activeProjectId}
      animate={true}
      callback={projectToggleHandler}
      key={projectId}
      projectId={projectId}
      project={projects[projectId]}
      handleDelete={() => { deleteHandler(projectId) }} />
  })

  if (projectList.length === 0) {
    return (
      <div className="project-list__empty-state">
        <div className="project-list__empty-state-content">
          <div className="icon-with-background">
            <ProjectIcon width="48" height="48" />
          </div>
          <h2>Create your first project</h2>
          <p>Let’s get you going! Create a project and start adding or importing documents</p>
          <Link to={PATH_PROJECT_CREATE} className="btn">Get started</Link>
        </div>
      </div>
    )
  }

  return (
    <ol className="project-list" ref={nodeRef}>{projectList}</ol>
  )
}

ProjectsListComponent.propTypes = {
  deleteHandler: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired
}

export default ProjectsListComponent
