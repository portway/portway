import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

const ProjectsListItem = ({
  activeProjectId,
  animate,
  callback,
  projectId,
  project,
  handleDelete
}) => {
  const [itemHeight, setItemHeight] = useState(null)
  // Set the width and height of the list item after render so that we can animate
  // these properties
  const itemRef = useCallback((node) => {
    if (node !== null) {
      setItemHeight(node.getBoundingClientRect().height)
    }
  }, [])

  const projectClasses = classNames({
    'project-list__item': true,
    'project-list__item--animate': animate,
    'project-list__item--active': activeProjectId === projectId,
    'project-list__item--disabled': activeProjectId && activeProjectId !== projectId
  })

  const activeProjectWidth = animate ? '103%' : '100%'
  const activeProjectHeight = animate ? '200px' : 'auto'
  const projectWidth = activeProjectId === projectId ? activeProjectWidth : `100%`
  const projectHeight = activeProjectId === projectId ? activeProjectHeight : `${itemHeight}px`

  return (
    <li
      aria-expanded={activeProjectId === projectId}
      aria-haspopup={true}
      className={projectClasses}
      ref={itemRef}
      style={{ height: `${projectHeight}`, width: `${projectWidth}` }}>
      <div
        className="project-list__info"
        onClick={() => callback(projectId)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            callback(projectId)
          }
        }}
        role="button"
        tabIndex="0">
        <span className="icon icon-project" />
        <span>
          <h3 className="project-list__title">{project.name}</h3>
          <p className="project-list__item-meta">Last updated by _USER_</p>
        </span>
      </div>
      <div className="project-list__actions" hidden={activeProjectId !== projectId}>
        <div className="project-list__actions-start">
          <button className="btn btn--blank btn--warning" onClick={handleDelete}>
            Delete
          </button>
        </div>
        <div className="project-list__actions-end">
          <button className="btn btn--blank">Duplicate</button>
          <button className="btn btn--blank">Settings</button>
          <Link to={`/project/${projectId}`} className="btn" role="button" tabIndex="0">
            Open
          </Link>
        </div>
      </div>
    </li>
  )
}

ProjectsListItem.propTypes = {
  activeProjectId: PropTypes.string,
  animate: PropTypes.bool,
  callback: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default ProjectsListItem
