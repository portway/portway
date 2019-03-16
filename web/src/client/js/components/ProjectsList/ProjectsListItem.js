import React, { useState, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useClickOutside from 'Hooks/useClickOutside'

const ProjectsListItem = ({ projectId, project }) => {
  const [expanded, setExpanded] = useState(false)
  const nodeRef = useRef()
  const collapseCallback = useCallback(() => {
    setExpanded(false)
  }, [])
  useClickOutside(nodeRef, collapseCallback)

  return (
    <li>
      <div
        className="project-list__item"
        aria-expanded={expanded}
        aria-haspopup={true}
        ref={nodeRef}>
        <div
          className="project-list__info"
          onClick={() => setExpanded(true)}
          onKeyDown={(e) => { if (e.keyCode === 13) { setExpanded(true) }}}
          role="button"
          tabIndex="0">
          <div className="focus-content" tabIndex="-1">
            <span className="icon icon-project" />
            <span>
              <h3 className="project-list__title">{project.name}</h3>
              <p className="project-list__item-meta">Last updated by _USER_</p>
            </span>
          </div>
        </div>
        <div className="project-list__actions" hidden={!expanded}>
          <button className="btn btn--blank btn--warning">Delete</button>
          <button className="btn btn--blank">Duplicate</button>
          <button className="btn btn--blank">Settings</button>
          <Link to={`/project/${projectId}`} className="btn" role="button">
            Open
          </Link>
        </div>
      </div>
    </li>
  )
}

ProjectsListItem.propTypes = {
  projectId: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired
}

export default ProjectsListItem
