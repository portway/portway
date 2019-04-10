/* eslint-disable max-len */
import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Redirect } from 'react-router-dom'

import Constants from 'Shared/constants'
import ProjectSettingsInfoComponent from './ProjectSettingsInfoComponent'

import './ProjectSettings.scss'

const ProjectSettingsComponent = ({ projectId, project, setting, projectUpdateHandler }) => {
  if (!project || !projectId) return null
  const settingsSectionPath = `${Constants.PATH_PROJECT}/${projectId}/settings`

  function renderProjectSettingPanel() {
    switch (setting) {
      case 'info':
        const updateInfoHandler = (e) => {
          projectUpdateHandler('info', e)
        }
        return <ProjectSettingsInfoComponent project={project} onUpdateHandler={updateInfoHandler} />
      default:
        return <Redirect to={`${settingsSectionPath}/info`} />
    }
  }

  return (
    <div className="project-settings">
      <div className="project-settings__container">
        <nav className="project-settings__navigation">
          <ul className="list-blank">
            <li><NavLink to={`${settingsSectionPath}/info`}>Info</NavLink></li>
            <li><NavLink to={`${settingsSectionPath}/teams`}>Teams</NavLink></li>
            <li><NavLink to={`${settingsSectionPath}/endpoints`}>Endpoints</NavLink></li>
            <li><NavLink to={`${settingsSectionPath}/keys`}>Keys</NavLink></li>
          </ul>
        </nav>
        <div className="project-settings__panel">
          {renderProjectSettingPanel()}
        </div>
      </div>
    </div>
  )
}

ProjectSettingsComponent.propTypes = {
  projectId: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  projectUpdateHandler: PropTypes.func,
  setting: PropTypes.string
}

ProjectSettingsComponent.defaultProps = {
  projectId: '',
  project: {},
  setting: ''
}

export default ProjectSettingsComponent
