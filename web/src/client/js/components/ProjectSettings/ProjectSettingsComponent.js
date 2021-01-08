import React, { lazy } from 'react'
import PropTypes from 'prop-types'
import { NavLink, Redirect } from 'react-router-dom'

import { MULTI_USER_PLAN_TYPES, PATH_PROJECT, ORG_SUBSCRIPTION_STATUS } from 'Shared/constants'
import { APIKeyIcon, ExportIcon, InfoIcon, TeamsIcon, WebhookIcon } from 'Components/Icons'
import { Panel, PanelNavigation, PanelContent } from 'Components/Panel'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import ProjectSettingsInfoContainer from './ProjectSettingsInfo/ProjectSettingsInfoContainer'
import ProjectSettingsTokensContainer from './ProjectSettingsTokens/ProjectSettingsTokensContainer'
import ProjectSettingsExportContainer from './ProjectSettingsExport/ProjectSettingsExportContainer'
import ProjectSettingsWebhooksContainer from './ProjectSettingsWebhooks/ProjectSettingsWebhooksContainer'

const ProjectSettingsTeamsContainer = lazy(() => import(/* webpackChunkName: 'ProjectSettingsTeamsContainer' */ './ProjectSettingsTeams/ProjectSettingsTeamsContainer'))

const SETTINGS_PATHS = {
  EXPORT: 'export',
  WEBHOOKS: 'webhooks',
  INFO: 'info',
  KEYS: 'keys',
  TEAMS: 'teams',
}

const ProjectSettingsComponent = ({ projectId, setting }) => {
  if (!projectId) return null
  const settingsSectionPath = `${PATH_PROJECT}/${projectId}/settings`

  const PANEL_PATHS = {
    [SETTINGS_PATHS.INFO]: <ProjectSettingsInfoContainer />,
    [SETTINGS_PATHS.TEAMS]: <ProjectSettingsTeamsContainer />,
    [SETTINGS_PATHS.KEYS]: <ProjectSettingsTokensContainer />,
    [SETTINGS_PATHS.WEBHOOKS]: <ProjectSettingsWebhooksContainer />,
    [SETTINGS_PATHS.EXPORT]: <ProjectSettingsExportContainer />,
    default: <Redirect to={`${settingsSectionPath}/info`} />
  }

  return (
    <Panel>
      <PanelNavigation>
        <NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.INFO}`} aria-label="Info">
          <InfoIcon /> <span className="label">Info</span>
        </NavLink>
        <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES} acceptedSubscriptionStatuses={[ORG_SUBSCRIPTION_STATUS.ACTIVE]}>
          <NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.TEAMS}`} aria-label="Teams">
            <TeamsIcon /> <span className="label">Team</span>
          </NavLink>
        </OrgPlanPermission>
        <NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.KEYS}`} aria-label="API Keys">
          <APIKeyIcon /> <span className="label">API keys</span>
        </NavLink>
        <NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.WEBHOOKS}`} aria-label="Webhooks">
          <WebhookIcon /> <span className="label">Webhooks</span>
        </NavLink>
        <NavLink to={`${settingsSectionPath}/${SETTINGS_PATHS.EXPORT}`} aria-label="Export your project">
          <ExportIcon /> <span className="label">Export</span>
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
