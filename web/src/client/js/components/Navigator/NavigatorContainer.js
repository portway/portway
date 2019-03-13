import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'

import NavigatorComponent from './NavigatorComponent'
import useDataService from 'Hooks/useDataService'
import dataMapper from '../../libs/dataMapper'

const NavigatorContainer = ({ match }) => {
  const { data: projects } = useDataService(dataMapper.projects.list())
  // const project = useDataService(dataMapper.project.id(match.params.id))
  const project = null

  return <NavigatorComponent projects={projects} project={project} match={match} />
}

NavigatorContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(NavigatorContainer)
