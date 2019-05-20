import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Select, { components } from 'react-select'
import cx from 'classnames'
import { Helmet } from 'react-helmet'

import { withRouter, Link } from 'react-router-dom'

import Constants from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'
import dataMapper from 'Libs/dataMapper'
import currentResource from 'Libs/currentResource'

import { CaretIcon, ProjectIcon } from 'Components/Icons'
import ProjectPermission from 'Components/Permission/ProjectPermission'

import './Navigator.scss'

const { PRODUCT_NAME, PROJECT_ROLE_IDS } = Constants

const NavigatorContainer = ({ history, location }) => {
  const { data: projects } = useDataService(dataMapper.projects.list())
  const { data: project } = useDataService(
    currentResource('project', location.pathname), [location.pathname]
  )

  const [expanded, setExpanded] = useState(false)
  const selectRef = useRef()
  const nodeRef = useRef()
  const collapseCallback = useCallback(() => {
    setExpanded(false)
  }, [])
  const toggleCallback = useCallback(() => {
    setExpanded(!expanded)
    if (!expanded) {
      selectRef.current.focus()
    }
  }, [expanded])
  useClickOutside(nodeRef, collapseCallback)
  useBlur(nodeRef, collapseCallback)
  useKeyboardShortcut('t', toggleCallback)

  // Customizing React-Select components
  const Option = (props) => {
    // eslint-disable-next-line react/prop-types
    const { data, innerRef, innerProps, isFocused } = props
    const classnames = cx({
      'menu__item': true,
      'menu__item--is-focused': isFocused
    })
    return (
      <div className={classnames} ref={innerRef} {...innerProps}>
        <ProjectIcon fill="#d2e0f2" />
        <components.Option {...props} />
        <ProjectPermission
          projectId={data.value}
          acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]} >
          <Link
            className="navigator__settings"
            onClick={(e) => {
              e.stopPropagation()
              collapseCallback()
            }}
            to={`${Constants.PATH_PROJECT}/${data.value}/settings`}>
            Settings
          </Link>
        </ProjectPermission>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{project ? project.name : 'My Projects'} –– {PRODUCT_NAME}</title>
      </Helmet>
      <div ref={nodeRef} className="navigator">
        <button
          aria-haspopup
          aria-expanded={expanded}
          className="btn btn--blank btn--with-circular-icon"
          onClick={toggleCallback}>
          <CaretIcon />
          <span className="label">{project ? project.name : 'Projects'}</span>
        </button>
        <div className="menu menu--dark" hidden={!expanded}>
          <Select
            ref={selectRef}
            className={`navigator__select`}
            classNamePrefix="react-select"
            components={{ Option }}
            menuIsOpen={true}
            onChange={(value) => {
              history.push({
                pathname: `${Constants.PATH_PROJECT}/${value.value}`
              })
              collapseCallback()
            }}
            options={Object.values(projects).map((project) => {
              return { label: project.name, value: String(project.id) }
            })}
            value={null} />
        </div>
      </div>
    </>
  )
}

NavigatorContainer.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(NavigatorContainer)
