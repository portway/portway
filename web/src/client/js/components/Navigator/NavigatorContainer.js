import React from 'react'
import PropTypes from 'prop-types'
import { components } from 'react-select'

import { withRouter, Link } from 'react-router-dom'

// import NavigatorComponent from './NavigatorComponent'
import Constants from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from '../../libs/dataMapper'
import currentResource from '../../libs/currentResource'

import { CaretIcon } from 'Components/Icons'
import DropdownSelectComponent from 'Components/DropdownSelect/DropdownSelectComponent'

import './Navigator.scss'

const NavigatorContainer = ({ history, location }) => {
  const { data: projects } = useDataService(dataMapper.projects.list())

  const { data: project } = useDataService(
    currentResource('project', location.pathname), [location.pathname]
  )

  // Customizing React-Select components
  const Option = (props) => {
    // eslint-disable-next-line react/prop-types
    const { data, innerRef, innerProps } = props
    return (
      <div className="menu__item" ref={innerRef} {...innerProps}>
        <components.Option {...props} />
        <Link to={`${Constants.PATH_PROJECT}/${data.value}/settings`}>Settings</Link>
      </div>
    )
  }

  // Customizing Menu component
  const Menu = (props) => {
    // eslint-disable-next-line react/prop-types
    const { children } = props
    return (
      <components.Menu {...props}>
        <div className="navigator__info small">
          Switch to a different project
        </div>
        {children}
      </components.Menu>
    )
  }

  const dropdownButton = {
    label: project ? project.name : 'Projects',
    className: 'btn--blank h-third-level',
    icon: <CaretIcon width="18" height="18" />
  }
  const menu = {
    collapseOnChange: true,
    customComponents: {
      Menu,
      Option
    },
    isOpen: true,
    hasAutoComplete: true,
    options: Object.values(projects).map((project) => {
      return { label: project.name, value: String(project.id) }
    }),
    onChange: (value) => {
      history.push({
        pathname: `${Constants.PATH_PROJECT}/${value.value}`
      })
    }
  }
  return (
    <div>
      <DropdownSelectComponent
        className="navigator" button={dropdownButton} menu={menu} shortcut="t" />
    </div>
  )
}

NavigatorContainer.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(NavigatorContainer)
