import React from 'react'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { ORGANIZATION_ROLE_IDS, PATH_PROJECTS, PRODUCT_NAME } from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import OrgPermission from 'Components/Permission/OrgPermission'
import AdminBillingComponent from './AdminBillingComponent'
import { updateOrganizationPlan } from 'Actions/organization'
import { currentOrgId } from 'Libs/currentIds'

const AdminBillingContainer = ({ updateOrganizationPlan }) => {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())

  const planSelectorId = 'plan-selector'

  function planChangeHandler(val) {
    updateOrganizationPlan(planSelectorId, currentOrgId, { plan: val })
  }

  return (
    <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<Redirect to={PATH_PROJECTS} />}>
      <Helmet>
        <title>Account Settings: Billing – {PRODUCT_NAME}</title>
      </Helmet>
      <AdminBillingComponent formId={planSelectorId} organizationPlan={currentOrg.plan} planChangeHandler={planChangeHandler} />
    </OrgPermission>
  )
}

AdminBillingContainer.propTypes = {
  updateOrganizationPlan: PropTypes.func.isRequired
}

const mapDispatchToProps = { updateOrganizationPlan }

export default connect(null, mapDispatchToProps)(AdminBillingContainer)
