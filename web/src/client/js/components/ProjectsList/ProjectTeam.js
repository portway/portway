import React, { lazy } from 'react'
import PropTypes from 'prop-types'

import { MULTI_USER_PLAN_TYPES } from 'Shared/constants'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'

// Lazy loading because not all users have access to this
const ProjectUsersContainer = lazy(() => import(/* webpackChunkName: 'ProjectUsersContainer' */ 'Components/ProjectUsers/ProjectUsersContainer'))

const ProjectTeam = ({ projectId, show }) => {
  return (
    <div className="project-list__team">
      <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES}>
        {show && <ProjectUsersContainer collapsed={true} projectId={projectId} />}
      </OrgPlanPermission>
    </div>
  )
}

ProjectTeam.propTypes = {
  projectId: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
}

export default ProjectTeam
