import React from 'react'

import ProjectCreatorContainer from 'Components/ProjectForm/ProjectCreatorContainer'
import { withOrgPermission } from 'Components/Permission/OrgPermission'
import Constants from 'Shared/constants'

const { ORGANIZATION_ROLE_IDS } = Constants

const ProjectCreate = () => {
  return (
    <main>
      <div className="section">
        <h1>Create a new project</h1>
        <h2>Projects can have multiple users and documents</h2>
      </div>
      <ProjectCreatorContainer />
    </main>
  )
}

export default withOrgPermission([ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN])(ProjectCreate)
