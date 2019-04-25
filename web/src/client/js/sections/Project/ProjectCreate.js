import React from 'react'

import ProjectCreatorContainer from 'Components/ProjectForm/ProjectCreatorContainer'
import { withOrgPermission } from 'Components/Permission/OrgPermission'

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

export default withOrgPermission([1, 2])(ProjectCreate)
