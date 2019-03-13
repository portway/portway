import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'

import NavigatorComponent from './NavigatorComponent'
import useDataService from 'Hooks/useDataService'
import dataMapper from '../../libs/dataMapper'
import currentResource from '../../libs/currentResource'

const NavigatorContainer = ({ match }) => {
  const { data: projects } = useDataService(dataMapper.projects.list())
  const { data: project } = useDataService(currentResource(match), [match])

  return <NavigatorComponent projects={projects} project={project} match={match} />
}

NavigatorContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(NavigatorContainer)
