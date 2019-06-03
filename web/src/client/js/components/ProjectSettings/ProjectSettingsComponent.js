import React from 'react'
import PropTypes from 'prop-types'
import { Link, NavLink, Redirect } from 'react-router-dom'

import { PATH_PROJECT } from 'Shared/constants'
import { Panel, PanelNavigation, PanelContent } from 'Components/Panel'
import ProjectSettingsInfoContainer from './ProjectSettingsInfo/ProjectSettingsInfoContainer'
import ProjectSettingsTeamsContainer from './ProjectSettingsTeams/ProjectSettingsTeamsContainer'
import ProjectSettingsTokensContainer from './ProjectSettingsTokens/ProjectSettingsTokensContainer'

const SETTINGS_PATHS = {
  INFO: 'info',
  TEAMS: 'teams',
  ENDPOINTS: 'endpoints',
  KEYS: 'keys'
}

const ProjectSettingsComponent = ({ projectId, setting }) => {
  if (!projectId) return null
  const settingsSectionPath = `${PATH_PROJECT}/${projectId}/settings`

  const PANEL_PATHS = {
    [SETTINGS_PATHS.INFO]: <ProjectSettingsInfoContainer />,
    [SETTINGS_PATHS.TEAMS]: <ProjectSettingsTeamsContainer />,
    [SETTINGS_PATHS.KEYS]: <ProjectSettingsTokensContainer />,
    default: <Redirect to={`${settingsSectionPath}/info`} />
  }

  return (
    <Panel>
      <PanelNavigation>
        <Link to={`${PATH_PROJECT}/${projectId}`} className="link--back">Back to Project</Link>
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
