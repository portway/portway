import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { updateOrganizationPlan } from 'Actions/organization'
import AdminPlanSelectorComponent from './AdminPlanSelectorComponent'

const AdminPlanSelectorContainer = ({ updateOrganizationPlan }) => {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())

  // Form ID for form actions
  const planSelectorId = 'plan-selector'

  function planChangeHandler(val) {
    updateOrganizationPlan(planSelectorId, currentOrg.id, { plan: val })
  }

  return (
    <AdminPlanSelectorComponent
      formId={planSelectorId}
      organizationPlan={currentOrg.plan}
      organizationSubscriptionStatus={currentOrg.subscriptionStatus}
      planChangeHandler={planChangeHandler}
    />
  )
}

AdminPlanSelectorContainer.propTypes = {
  updateOrganizationPlan: PropTypes.func.isRequired
}

const mapDispatchToProps = { updateOrganizationPlan }

export default connect(null, mapDispatchToProps)(AdminPlanSelectorContainer)
