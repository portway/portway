import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { PLAN_TYPES, PRICING } from 'Shared/constants'
import { uiConfirm } from 'Actions/ui'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { updateOrganizationPlan } from 'Actions/organization'
import AdminPlanSelectorComponent from './AdminPlanSelectorComponent'

const AdminPlanSelectorContainer = ({ updateOrganizationPlan, uiConfirm }) => {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())

  // Form ID for form actions
  const planSelectorId = 'plan-selector'

  function planChangeHandler(val) {
    const planTitle = PLAN_TYPES[val] === PLAN_TYPES.SINGLE_USER ? 'Single-user plan' : 'Multi-user plan'
    const message = (
      <span>Change your plan to a {planTitle}? <b>You will be charged {PRICING[val]}</b></span>
    )
    const confirmedAction = () => {
      updateOrganizationPlan(planSelectorId, currentOrg.id, { plan: val })
    }
    const confirmedLabel = 'Yes, I understand'
    uiConfirm({ message, confirmedAction, confirmedLabel })
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
  updateOrganizationPlan: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired,
}

const mapDispatchToProps = { updateOrganizationPlan, uiConfirm }

export default connect(null, mapDispatchToProps)(AdminPlanSelectorContainer)
