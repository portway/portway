import React from 'react'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'

import { ORGANIZATION_ROLE_IDS, PATH_PROJECTS, PRODUCT_NAME } from 'Shared/constants'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import OrgPermission from 'Components/Permission/OrgPermission'
import AdminBillingComponent from './AdminBillingComponent'

const AdminBillingContainer = () => {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())

  return (
    <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<Redirect to={PATH_PROJECTS} />}>
      <Helmet>
        <title>Account Settings: Billing – {PRODUCT_NAME}</title>
      </Helmet>
      <AdminBillingComponent organization={currentOrg} />
    </OrgPermission>
  )
}

export default AdminBillingContainer
