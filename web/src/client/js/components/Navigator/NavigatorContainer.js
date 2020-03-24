import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Select, { components } from 'react-select'
import cx from 'classnames'
import { Helmet } from 'react-helmet'
import { withRouter, Link } from 'react-router-dom'

import {
  ORGANIZATION_ROLE_IDS,
  ORGANIZATION_SETTINGS,
  PATH_PROJECT,
  PATH_PROJECTS,
  PATH_PROJECT_CREATE,
  PRODUCT_NAME,
  PROJECT_ROLE_IDS,
  TITLE_PROJECTS
} from 'Shared/constants'

import useDataService from 'Hooks/useDataService'
import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'
import dataMapper from 'Libs/dataMapper'
import currentResource from 'Libs/currentResource'

import { CaretIcon, ProjectIcon } from 'Components/Icons'
import { Popper, PopperGroup } from 'Components/Popper/Popper'
import { Menu } from 'Components/Menu'
import ProjectPermission from 'Components/Permission/ProjectPermission'
import OrgPermission from 'Components/Permission/OrgPermission'

import './_Navigator.scss'

const NavigatorContainer = ({ history, location }) => {
  const { data: { projects } } = useDataService(dataMapper.projects.list())
  const { data: project } = useDataService(
    currentResource('project', location.pathname), [location.pathname]
  )

  let title = 'Projects'
  if (location.pathname !== PATH_PROJECTS && project) {
    title = project.name
  }

  const [expanded, setExpanded] = useState(false)
  const selectRef = useRef()
  const nodeRef = useRef()
  const anchorRef = useRef()

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

  const NoOptionsMessage = (props) => {
    // eslint-disable-next-line react/prop-types
    const { innerRef, innerProps } = props
    return (
      <div className="navigator__empty-item" ref={innerRef} {...innerProps}>
        <OrgPermission
          acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}
          acceptedSettings={[ORGANIZATION_SETTINGS.ALLOW_USER_PROJECT_CREATION]}>
          <Link to={PATH_PROJECT_CREATE}
            className="btn btn--small btn--blank navigator__project-btn"
            onClick={collapseCallback}
            title="Create a new project">
            Get started by creating a project
          </Link>
        </OrgPermission>
      </div>
    )
  }

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
        <ProjectIcon fill="#72D9EE" />
        <components.Option {...props} />
        <ProjectPermission
          projectIdOverride={data.value}
          acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]} >
          <Link
            className="navigator__settings"
            onClick={(e) => {
              e.stopPropagation()
              collapseCallback()
            }}
            to={`${PATH_PROJECT}/${data.value}/settings`}>
            Settings
          </Link>
        </ProjectPermission>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{project ? project.name : TITLE_PROJECTS} –– {PRODUCT_NAME}</title>
      </Helmet>
      <PopperGroup anchorRef={nodeRef} className="navigator">
        <button
          aria-haspopup
          aria-expanded={expanded}
          className="btn btn--blank btn--with-circular-icon"
          onClick={toggleCallback}
          ref={anchorRef}
        >
          <CaretIcon />
          <span className="label">{title}</span>
        </button>
        <Popper anchorRef={anchorRef} autoCollapse={collapseCallback} open={expanded} width="300">
          <Menu anchorRef={anchorRef}>
            <Select
              ref={selectRef}
              className={`navigator__select`}
              classNamePrefix="react-select"
              components={{ NoOptionsMessage, Option }}
              menuIsOpen={true}
              onChange={(value) => {
                history.push({
                  pathname: `${PATH_PROJECT}/${value.value}`
                })
                collapseCallback()
              }}
              options={Object.values(projects).map((project) => {
                return { label: project.name, value: String(project.id) }
              })}
              value={null} />
            <footer className="menu__footer">
              <OrgPermission
                acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}
                acceptedSettings={[ORGANIZATION_SETTINGS.ALLOW_USER_PROJECT_CREATION]}>
                <Link to={PATH_PROJECT_CREATE}
                  className="btn btn--small btn--blank navigator__project-btn"
                  onClick={collapseCallback}
                  title="Create a new project">
                  New Project
                </Link>
              </OrgPermission>
            </footer>
          </Menu>
        </Popper>
      </PopperGroup>
    </>
  )
}

NavigatorContainer.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(NavigatorContainer)
