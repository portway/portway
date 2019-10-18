import React from 'react'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'

import { ORGANIZATION_ROLE_IDS, PATH_PROJECTS, PRODUCT_NAME } from 'Shared/constants'
import OrgPermission from 'Components/Permission/OrgPermission'
import AdminBillingComponent from './AdminBillingComponent'

const AdminBillingContainer = () => {
  function planChangeHandler(val) {
    console.log(`Change to ${val} plan`)
  }

  return (
    <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<Redirect to={PATH_PROJECTS} />}>
      <Helmet>
        <title>Account Settings: Billing – {PRODUCT_NAME}</title>
      </Helmet>
      <AdminBillingComponent planChangeHandler={planChangeHandler} />
    </OrgPermission>
  )
}

export default AdminBillingContainer
