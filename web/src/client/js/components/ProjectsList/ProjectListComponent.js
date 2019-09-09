import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { ProjectIcon } from 'Components/Icons'
import { PATH_PROJECT_CREATE } from 'Shared/constants'
import useClickOutside from 'Hooks/useClickOutside'
import ProjectsListItem from './ProjectsListItem'
import './_ProjectList.scss'

function ProjectsListComponent({ deleteHandler, loading, projects }) {
  const [activeProjectId, setActiveProjectId] = useState(null)

  console.log(loading)

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

  if (!loading && projectList.length === 0) {
    return (
      <div className="project-list__empty-state">
        <div className="notice">
          <div className="notice__icon">
            <ProjectIcon width="32" height="32" />
          </div>
          <h2 className="notice__header">Create your first project</h2>
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
  loading: PropTypes.bool.isRequired,
  projects: PropTypes.object.isRequired
}

ProjectsListComponent.defaultProps = {
  loading: true,
}

export default ProjectsListComponent
