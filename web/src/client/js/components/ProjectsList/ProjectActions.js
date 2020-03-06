import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { PROJECT_ROLE_IDS } from 'Shared/constants'
import { SettingsIcon, TrashIcon } from 'Components/Icons'
import ProjectPermission from 'Components/Permission/ProjectPermission'

const ProjectActions = ({ handleDelete, projectId }) => {
  return (
    <div className="project-list__actions">
      <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]} projectIdOverride={projectId}>
        <div className="project-list__action-buttons">
          <Link aria-label="Project settings" to={`/project/${projectId}/settings`} className="btn btn--blank">
            <SettingsIcon />
          </Link>
          <button
            aria-label="Delete project"
            name="deleteProject"
            className="btn btn--blank"
            onClick={handleDelete}
          >
            <TrashIcon />
          </button>
        </div>
      </ProjectPermission>
    </div>
  )
}

ProjectActions.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  projectId: PropTypes.number.isRequired,
}

export default ProjectActions
