import React from 'react'
import { Helmet } from 'react-helmet'

import ProjectCreatorContainer from 'Components/ProjectForm/ProjectCreatorContainer'
import { withOrgPermission } from 'Components/Permission/OrgPermission'
import Constants from 'Shared/constants'

const { ORGANIZATION_ROLE_IDS, PRODUCT_NAME } = Constants

const ProjectCreate = () => {
  return (
    <>
      <Helmet>
        <title>Create a Project – {PRODUCT_NAME}</title>
      </Helmet>
      <main>
        <div className="section">
          <h2>Create a new project</h2>
          <h3>Projects can have multiple users and documents</h3>
        </div>
        <ProjectCreatorContainer />
      </main>
    </>
  )
}

export default withOrgPermission([ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN])(ProjectCreate)
