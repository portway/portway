import React, { lazy } from 'react'
import PropTypes from 'prop-types'
import { NavLink, Redirect } from 'react-router-dom'

import { MULTI_USER_PLAN_TYPES, PATH_PROJECT } from 'Shared/constants'
import { InfoIcon, APIKeyIcon, TeamsIcon } from 'Components/Icons'
import { Panel, PanelNavigation, PanelContent } from 'Components/Panel'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import ProjectSettingsInfoContainer from './ProjectSettingsInfo/ProjectSettingsInfoContainer'
import ProjectSettingsTokensContainer from './ProjectSettingsTokens/ProjectSettingsTokensContainer'

const ProjectSettingsTeamsContainer = lazy(() => import(/* webpackChunkName: 'ProjectSettingsTeamsContainer' */ './ProjectSettingsTeams/ProjectSettingsTeamsContainer'))

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
        <NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.INFO}`} aria-label="Info">
          <InfoIcon /> <span className="label">Info</span>
        </NavLink>
        <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES}>
          <NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.TEAMS}`} aria-label="Teams">
            <TeamsIcon /> <span className="label">Team</span>
          </NavLink>
        </OrgPlanPermission>
        <NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.KEYS}`} aria-label="API Keys">
          <APIKeyIcon /> <span className="label">API Keys</span>
        </NavLink>
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
