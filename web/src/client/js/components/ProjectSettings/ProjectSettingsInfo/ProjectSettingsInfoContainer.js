import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Store from '../../../reducers'
import { updateProject } from 'Actions/project'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import { debounce } from 'Shared/utilities'
import ProjectSettingsInfoComponent from './ProjectSettingsInfoComponent'

const ProjectSettingsInfoContainer = ({ errors, location }) => {
  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])

  if (!project) return null

  const debouncedUpdateHandler = debounce(1000, (body) => {
    Store.dispatch(updateProject(project.id, body))
  })

  return (
    <ProjectSettingsInfoComponent errors={errors} project={project} updateProjectHandler={debouncedUpdateHandler} />
  )
}

ProjectSettingsInfoContainer.propTypes = {
  errors: PropTypes.object,
  location: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    errors: state.formErrors.project
  }
}

export default withRouter(
  connect(mapStateToProps)(ProjectSettingsInfoContainer)
)
