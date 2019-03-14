import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'

// import NavigatorComponent from './NavigatorComponent'
import useDataService from 'Hooks/useDataService'
import dataMapper from '../../libs/dataMapper'
import currentResource from '../../libs/currentResource'
import DropdownComponent from 'Components/Dropdown/DropdownComponent'

const NavigatorContainer = ({ match }) => {
  const { data: projects } = useDataService(dataMapper.projects.list())
  const { data: project } = useDataService(currentResource(match), [match])
  const dropdownButton = { label: project ? project.name : 'Projects', className: 'btn--blank', icon: 'icon-caret-down' }
  console.log(projects)
  const menu = {
    isOpen: true,
    options: Object.values(projects).map((project) => {
      return { label: project.name, value: project.id }
    }),
    onChange: value => console.log(value)
  }
  return <DropdownComponent button={dropdownButton} menu={menu} />
  // return <NavigatorComponent projects={projects} project={project} match={match} />
}

NavigatorContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(NavigatorContainer)
