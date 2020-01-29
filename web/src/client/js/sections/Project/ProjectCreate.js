import React from 'react'
import { Helmet } from 'react-helmet'

import { ORGANIZATION_ROLE_IDS, PRODUCT_NAME } from 'Shared/constants'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import ProjectCreatorContainer from 'Components/ProjectForm/ProjectCreatorContainer'

const ProjectCreate = () => {
  const { data: organization } = useDataService(dataMapper.organizations.current())
  const { data: currentUser } = useDataService(dataMapper.users.current())

  const acceptableCreatorRoles = [ORGANIZATION_ROLE_IDS.ADMIN, ORGANIZATION_ROLE_IDS.OWNER]

  return (
    <>
      <Helmet>
        <title>Create a Project – {PRODUCT_NAME}</title>
      </Helmet>
      <main>
        {(organization.allowUserProjectCreation || acceptableCreatorRoles.includes(currentUser.orgRoleId)) &&
        <>
          <div className="section">
            <h2>Create a new project</h2>
            <h3>Projects can have multiple users and documents</h3>
          </div>
          <ProjectCreatorContainer />
        </>
        }
      </main>
    </>
  )
}

export default ProjectCreate
