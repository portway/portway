import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Redirect } from 'react-router-dom'

import Constants from 'Shared/constants'
import { Panel, PanelNavigation, PanelContent } from 'Components/Panel'
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

  const PANEL_PATHS = {
    [SETTINGS_PATHS.INFO]: <ProjectSettingsInfoContainer />,
    [SETTINGS_PATHS.TEAMS]: <ProjectSettingsTeamsContainer />,
    [SETTINGS_PATHS.KEYS]: <ProjectSettingsTokensContainer />,
    default: <Redirect to={`${settingsSectionPath}/info`} />
  }

  return (
    <Panel>
      <PanelNavigation>
        <NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.INFO}`}>Info</NavLink>
        <NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.TEAMS}`}>Teams</NavLink>
        <NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.KEYS}`}>API Keys</NavLink>
      </PanelNavigation>
      <PanelContent contentKey={setting} contentMap={PANEL_PATHS} />
    </Panel>
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
