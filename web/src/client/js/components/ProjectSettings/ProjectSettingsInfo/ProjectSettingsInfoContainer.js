import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { removeProject, updateProject } from 'Actions/project'
import { uiConfirm } from 'Actions/ui'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import { PRODUCT_NAME } from 'Shared/constants'
import * as strings from 'Loc/strings'
import ProjectSettingsInfoComponent from './ProjectSettingsInfoComponent'

const ProjectSettingsInfoContainer = ({ errors, removeProject, uiConfirm, updateProject }) => {
  const history = useHistory()
  const location = useLocation()

  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])

  if (!project) return null

  const formId = 'project-settings'

  function deleteProjectHandler() {
    const message = (
      <>
        <p className="danger">{strings.DELETE_PROJECT_TITLE}</p>
        <p>{strings.DELETE_PROJECT_DESCRIPTION}</p>
      </>
    )
    const options = {
      confirmedAction: () => { removeProject(project.id, history) },
      confirmedLabel: strings.DELETE_PROJECT_BUTTON_LABEL,
      confirmedText: project.name,
      theme: 'danger'
    }
    uiConfirm({ message, options })
  }

  const debouncedUpdateHandler = (body) => {
    updateProject(formId, project.id, body)
  }

  return (
    <>
      <Helmet>
        <title>{project.name}: Information –– {PRODUCT_NAME}</title>
      </Helmet>
      <ProjectSettingsInfoComponent
        deleteProjectHandler={deleteProjectHandler}
        errors={errors}
        formId={formId}
        project={project}
        updateProjectHandler={debouncedUpdateHandler}
      />
    </>
  )
}

ProjectSettingsInfoContainer.propTypes = {
  errors: PropTypes.object,
  removeProject: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.project
  }
}

const mapDispatchToProps = { removeProject, uiConfirm, updateProject }

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettingsInfoContainer)
