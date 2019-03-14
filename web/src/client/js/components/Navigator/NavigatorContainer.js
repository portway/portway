import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'

// import NavigatorComponent from './NavigatorComponent'
import Constants from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from '../../libs/dataMapper'
import currentResource from '../../libs/currentResource'
import DropdownComponent from 'Components/Dropdown/DropdownComponent'

const NavigatorContainer = ({ match, history }) => {
  const { data: projects } = useDataService(dataMapper.projects.list())
  const { data: project } = useDataService(currentResource(match), [match])
  const dropdownButton = {
    label: project ? project.name : 'Projects',
    className: 'btn--blank h-third-level',
    icon: 'icon-caret-down'
  }
  const menu = {
    collapseOnChange: true,
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
  return <DropdownComponent button={dropdownButton} menu={menu} />
}

NavigatorContainer.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default withRouter(NavigatorContainer)
