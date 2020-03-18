import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import { ORGANIZATION_ROLE_IDS, ORGANIZATION_SETTINGS, PATH_PROJECT_CREATE } from 'Shared/constants'
import { AddIcon } from 'Components/Icons'

import OrgPermission from 'Components/Permission/OrgPermission'
import ToolbarComponent from 'Components/Toolbar/ToolbarComponent'
import DashboardProjectsEmptyState from './DashboardProjectsEmptyState'
import ProjectListComponent from 'Components/ProjectsList/ProjectListComponent'

import './_Dashboard.scss'

const DashboardComponent = ({ deleteHandler, loading, projects, specialProject, showTeams, sortProjectsHandler }) => {
  const history = useHistory()
  const hasProjects = Object.keys(projects).length > 0

  const toolbarAction = {
    callback: () => {
      history.push({ pathname: PATH_PROJECT_CREATE })
    },
    label: `New Project`,
    icon: <AddIcon width="12" height="12" />,
    title: 'New Project'
  }

  return (
    <div className="dashboard">
      <div className="dashboard__projects">
        <h3>Projects</h3>
        <OrgPermission
          acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}
          acceptedSettings={[ORGANIZATION_SETTINGS.ALLOW_USER_PROJECT_CREATION]}
          elseRender={(
            <ToolbarComponent action={{}} />
          )}>
          <ToolbarComponent action={toolbarAction} />
        </OrgPermission>
        {!loading && (hasProjects || specialProject) &&
          <ProjectListComponent
            history={history}
            deleteHandler={deleteHandler}
            projects={projects}
            showTeams={showTeams}
            specialProject={specialProject}
            sortProjectsHandler={sortProjectsHandler}
          />
        }
        {!loading && !hasProjects && !specialProject &&
          <DashboardProjectsEmptyState />
        }
      </div>
      <div className="dashboard__sidebar">
      </div>
    </div>
  )
}

DashboardComponent.propTypes = {
  deleteHandler: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  projects: PropTypes.object.isRequired,
  showTeams: PropTypes.bool.isRequired,
  specialProject: PropTypes.object,
  sortProjectsHandler: PropTypes.func.isRequired
}

export default DashboardComponent
