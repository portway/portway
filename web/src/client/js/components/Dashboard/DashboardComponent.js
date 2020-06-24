import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import {
  ORGANIZATION_ROLE_IDS,
  ORGANIZATION_SETTINGS,
  PATH_PROJECT_CREATE
} from 'Shared/constants'
import { AddIcon } from 'Components/Icons'
import { currentUserId } from 'Libs/currentIds'

import OrgPermission from 'Components/Permission/OrgPermission'
import DashboardProjectsEmptyState from './DashboardProjectsEmptyState'
import ProjectsListComponent from 'Components/ProjectsList/ProjectsListComponent'
import { ToggleButton } from 'Components/Buttons'

import './_Dashboard.scss'

const DashboardComponent = ({
  deleteHandler,
  loading,
  projects,
  specialProject,
  showTeams,
  sortProjectsHandler,
  sortBy,
  sortMethod
}) => {
  const [showMyProjects, toggleMyProjects] = useState(false)
  const history = useHistory()
  const hasProjects = projects.length > 0
  const { myProjects, notMyProjects } = projects.reduce((cur, project) => {
    if (project.createdBy === currentUserId) {
      cur.myProjects = [...cur.myProjects, project]
    } else {
      cur.notMyProjects = [...cur.notMyProjects, project]
    }
    return cur
  }, { myProjects: [], notMyProjects: [] })

  return (
    <div className="dashboard">
      <div className="dashboard__projects">
        <div className="dashboard__toolbar">
          <OrgPermission
            acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}
            acceptedSettings={[ORGANIZATION_SETTINGS.ALLOW_USER_PROJECT_CREATION]}>
            <button
              aria-label="Create a new project"
              className="btn btn--blank btn--with-circular-icon"
              onClick={() => history.push({ pathname: PATH_PROJECT_CREATE })}
            >
              <AddIcon width="12" height="12" />
              <span className="label">New project</span>
            </button>
            <ToggleButton
              checked={showMyProjects}
              label="Filter projects"
              onClick={(checked) => { toggleMyProjects(checked) }}
              options={['All', 'Mine only']}
            />
          </OrgPermission>
        </div>
        {!loading && (hasProjects || specialProject) &&
          <>
            <ProjectsListComponent
              history={history}
              deleteHandler={deleteHandler}
              myProjectsOnly={showMyProjects}
              projects={showMyProjects ? myProjects : projects}
              showTeams={showTeams}
              specialProject={specialProject}
              sortProjectsHandler={sortProjectsHandler}
              sortBy={sortBy}
              sortMethod={sortMethod}
            />
            {showMyProjects && notMyProjects.length > 0 &&
            <div className="dashboard__footer">
              <button
                className="btn btn--like-a-link"
                onClick={() => { toggleMyProjects(false) }}
              >
                Hiding {notMyProjects.length} {notMyProjects.length > 1 ? 'projects' : 'project'}...
              </button>
            </div>
            }
          </>
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
  projects: PropTypes.array.isRequired,
  showTeams: PropTypes.bool.isRequired,
  specialProject: PropTypes.object,
  sortProjectsHandler: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortMethod: PropTypes.string.isRequired
}

export default DashboardComponent
