import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Redirect } from 'react-router-dom'

import Constants from 'Shared/constants'
import ProjectSettingsInfoContainer from './ProjectSettingsInfo/ProjectSettingsInfoContainer'
import ProjectSettingsTeamsContainer from './ProjectSettingsTeams/ProjectSettingsTeamsContainer'
import ProjectSettingsTokensContainer from './ProjectSettingsTokens/ProjectSettingsTokensContainer'

import './ProjectSettings.scss'

const SETTINGS_PATHS = {
  INFO: 'info',
  TEAMS: 'teams',
  ENDPOINTS: 'endpoints',
  KEYS: 'keys'
}

const ProjectSettingsComponent = ({ projectId, setting }) => {
  if (!projectId) return null
  const settingsSectionPath = `${Constants.PATH_PROJECT}/${projectId}/settings`

  function renderProjectSettingPanel() {
    switch (setting) {
      case SETTINGS_PATHS.INFO: {
        return <ProjectSettingsInfoContainer />
      }
      case SETTINGS_PATHS.TEAMS: {
        return <ProjectSettingsTeamsContainer />
      }
      case SETTINGS_PATHS.KEYS: {
        return <ProjectSettingsTokensContainer />
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
            <li><NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.KEYS}`}>API Keys</NavLink></li>
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
  setting: PropTypes.string
}

ProjectSettingsComponent.defaultProps = {
  projectId: '',
  setting: ''
}

export default ProjectSettingsComponent
