import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'

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

  return (
    <ol className="project-list" ref={nodeRef}>{projectList}</ol>
  )
}

ProjectsListComponent.propTypes = {
  deleteHandler: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired
}

export default ProjectsListComponent
