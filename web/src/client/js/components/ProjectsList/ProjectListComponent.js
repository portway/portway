import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import Store from '../../reducers'
import { removeProject } from 'Actions/project'
import useClickOutside from 'Hooks/useClickOutside'
import ProjectsListItem from './ProjectsListItem'
import './ProjectList.scss'

function ProjectsListComponent({ projects, history }) {
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
    const handleDelete = (e) => {
      e.preventDefault()
      Store.dispatch(removeProject(projectId, history))
    }

    return <ProjectsListItem
      activeProjectId={activeProjectId}
      animate={true}
      callback={projectToggleHandler}
      key={projectId}
      projectId={projectId}
      project={projects[projectId]}
      handleDelete={handleDelete}/>
  })

  return (
    <ol className="project-list" ref={nodeRef}>{projectList}</ol>
  )
}

ProjectsListComponent.propTypes = {
  projects: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default withRouter(ProjectsListComponent)
