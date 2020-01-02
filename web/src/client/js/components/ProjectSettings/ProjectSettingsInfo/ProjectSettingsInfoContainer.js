import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { updateProject } from 'Actions/project'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import { PRODUCT_NAME } from 'Shared/constants'
import ProjectSettingsInfoComponent from './ProjectSettingsInfoComponent'

const ProjectSettingsInfoContainer = ({ errors, location, updateProject }) => {
  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])

  if (!project) return null

  const formId = 'project-settings'

  const debouncedUpdateHandler = (body) => {
    updateProject(formId, project.id, body)
  }

  return (
    <>
      <Helmet>
        <title>{project.name}: Information –– {PRODUCT_NAME}</title>
      </Helmet>
      <ProjectSettingsInfoComponent errors={errors} formId={formId} project={project} updateProjectHandler={debouncedUpdateHandler} />
    </>
  )
}

ProjectSettingsInfoContainer.propTypes = {
  errors: PropTypes.object,
  location: PropTypes.object.isRequired,
  updateProject: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.project
  }
}

const mapDispatchToProps = { updateProject }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProjectSettingsInfoContainer)
)
