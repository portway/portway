import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Redirect } from 'react-router-dom'

import Constants from 'Shared/constants'
import ProjectSettingsInfoComponent from './ProjectSettingsInfoComponent'
import ProjectSettingsTeamsComponent from './ProjectSettingsTeamsComponent'

import './ProjectSettings.scss'

const SETTINGS_PATHS = {
  INFO: 'info',
  TEAMS: 'teams',
  ENDPOINTS: 'endpoints',
  KEYS: 'keys'
}

const ProjectSettingsComponent = ({ projectId, project, setting, projectUpdateHandler }) => {
  if (!project || !projectId) return null
  const settingsSectionPath = `${Constants.PATH_PROJECT}/${projectId}/settings`

  function renderProjectSettingPanel() {
    switch (setting) {
      case SETTINGS_PATHS.INFO: {
        const updateInfoHandler = (e) => {
          projectUpdateHandler(SETTINGS_PATHS.INFO, e)
        }
        return <ProjectSettingsInfoComponent project={project} onUpdateHandler={updateInfoHandler} />
      }
      case SETTINGS_PATHS.TEAMS: {
        const updateInfoHandler = (e) => {
          projectUpdateHandler(SETTINGS_PATHS.TEAMS, e)
        }
        return <ProjectSettingsTeamsComponent project={project} onUpdateHandler={updateInfoHandler} />
      }
      default:
        return <Redirect to={`${settingsSectionPath}/info`} />
    }
  }

  return (
    <div className="project-settings">
      <div className="project-settings__container">
        <nav className="project-settings__navigation">
          <ul className="list-blank">
            <li><NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.INFO}`}>Info</NavLink></li>
            <li><NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.TEAMS}`}>Teams</NavLink></li>
            <li><NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.ENDPOINTS}`}>Endpoints</NavLink></li>
            <li><NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.KEYS}`}>Keys</NavLink></li>
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
