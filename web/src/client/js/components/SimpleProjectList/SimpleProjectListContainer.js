import React from 'react'
import PropTypes from 'prop-types'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import SimpleProjectListComponent from './SimpleProjectListComponent'

const SimpleProjectListContainer = ({ limit = 5 }) => {
  const { data: projects } = useDataService(dataMapper.projects.list())
  if (!projects) return null

  const projectsArray = Object.values(projects)
  const limitedProjects = projectsArray.splice(0, limit)

  return <SimpleProjectListComponent projects={limitedProjects} />
}

SimpleProjectListContainer.propTypes = {
  limit: PropTypes.number
}

SimpleProjectListContainer.defaultProps = {
  limit: 5
}

export default SimpleProjectListContainer
