import React, { useState, useEffect, useRef, useReducer } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import NavigatorItemList from './NavigatorItemList'
import './Navigator.scss'

// eslint-disable-next-line no-unused-vars
const initialState = {
  expanded: false
}

function menuReducer(state, action) {
  switch (action.type) {
    case 'expand':
      return { ...state, expanded: true }
    case 'contract':
      return { ...state, expanded: false }
    default:
      throw new Error('Type should be "expand" or "contract".')
  }
}

const NavigatorComponent = ({ match, project, projects }) => {
  const nodeRef = useRef()
  const [state, dispatch] = useReducer(menuReducer, initialState)
  const section = match.path.split('/')[1]

  // When clicked outside or blurred, dispatch this action
  useClickOutside(nodeRef, dispatch, { type: 'contract' })
  useBlur(nodeRef, dispatch, { type: 'contract' })

  // If project Id changes, trigger contract
  useEffect(() => {
    dispatch({ type: 'contract' })
  }, [project])

  // The title of the component should be Projects or Project Name
  const [title, setTitle] = useState('')
  useEffect(() => {
    setTitle(project && project.name ? project.name : 'Projects')
  }, [project])

  return (
    <div ref={nodeRef} className={`navigator navigator--${section}`}>
      <button
        aria-expanded={state.expanded}
        aria-haspopup
        aria-label="Select a project"
        onClick={e => dispatch({ type: 'expand' })}>
        <h2 className="navigator__title h-third-level">{title}</h2>
      </button>
      <div className="navigator__menu" hidden={!state.expanded}>
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
