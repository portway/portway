import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ORGANIZATION_ROLE_IDS } from 'Shared/constants'

import { updateOrganizationSeats } from 'Actions/organization'
import OrgPermission from 'Components/Permission/OrgPermission'
import AdminSeatsComponent from './AdminSeatsComponent'
import { ADDITIONAL_SEAT_COST } from 'Shared/constants'

const AdminSeatsContainer = ({ currentOrgId, errors, orgBilling, updateOrganizationSeats }) => {
  if (!orgBilling) return null

  const formId = 'admin-seats-form'

  function adminSeatAdjustmentHandler(value) {
    const newSeatNumber = Number(value)
    updateOrganizationSeats(formId, currentOrgId, { seats: newSeatNumber })
  }
  // TODO: pull additional seat cost from orgBilling.subscription.additionalSeatCost  when we no longer have users on SINGLE_USER or SINGLE_USER trialing plans
  return (
    <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]}>
      <AdminSeatsComponent
        additionalSeatCost={ADDITIONAL_SEAT_COST / 100 }
        errors={errors}
        flatCost={orgBilling ? orgBilling.subscription.flatCost / 100 : 0}
        formId={formId}
        includedSeats={orgBilling ? orgBilling.subscription.includedSeats : 0}
        totalSeats={orgBilling ? orgBilling.subscription.totalSeats : 0}
        updateOrganizationSeats={adminSeatAdjustmentHandler}
        usedSeats={orgBilling ? orgBilling.subscription.usedSeats : 0}
        plan={orgBilling.plan}
      />
    </OrgPermission>
  )
}

AdminSeatsContainer.propTypes = {
  currentOrgId: PropTypes.number,
  errors: PropTypes.object,
  orgBilling: PropTypes.object,
  updateOrganizationSeats: PropTypes.func,
}

const mapStateToProps = (state) => {
  const currentOrgId = state.organizations.currentOrganizationId
  return {
    currentOrgId: currentOrgId,
    errors: state.validation.organization,
    orgBilling: state.organizations.organizationsBillingById[currentOrgId]
  }
}

const mapDispatchToProps = { updateOrganizationSeats }

export default connect(mapStateToProps, mapDispatchToProps)(AdminSeatsContainer)
