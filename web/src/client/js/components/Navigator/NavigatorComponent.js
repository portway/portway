import React, { useState, useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import NavigatorItemList from './NavigatorItemList'
import './Navigator.scss'

const NavigatorComponent = ({ match, project, projects }) => {
  const nodeRef = useRef()
  const [expanded, setExpanded] = useState()
  const section = match.path.split('/')[1]
  const title = project && project.name ? project.name : 'Projects'

  // When clicked outside or blurred, dispatch this action
  const collapseCallback = useCallback(() => {
    setExpanded(false)
  }, [])
  useClickOutside(nodeRef, collapseCallback)
  useBlur(nodeRef, collapseCallback)

  // If project Id changes, trigger contract
  useEffect(() => {
    setExpanded(false)
  }, [project])

  return (
    <div ref={nodeRef} className={`navigator navigator--${section}`}>
      <button
        aria-expanded={expanded}
        aria-haspopup
        aria-label="Select a project"
        onClick={() => setExpanded(false)}>
        <h2 className="navigator__title h-third-level">{title}</h2>
      </button>
      <div className="navigator__menu" hidden={!expanded}>
        <NavigatorItemList items={projects ? projects : {}} />
      </div>
    </div>
  )
}

NavigatorComponent.propTypes = {
  match: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired
}

export default NavigatorComponent
