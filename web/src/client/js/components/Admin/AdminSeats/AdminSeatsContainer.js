import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ORGANIZATION_ROLE_IDS } from 'Shared/constants'

import { updateOrganizationSeats } from 'Actions/organization'
import OrgPermission from 'Components/Permission/OrgPermission'
import AdminSeatsComponent from './AdminSeatsComponent'

const AdminSeatsContainer = ({ currentOrgId, errors, orgBilling, updateOrganizationSeats }) => {
  if (!orgBilling) return null

  const formId = 'admin-seats-form'

  function adminSeatAdjustmentHandler(value) {
    const newSeatNumber = Number(value)
    console.log(newSeatNumber)
    updateOrganizationSeats(formId, currentOrgId, { seats: newSeatNumber })
  }

  return (
    <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]}>
      <AdminSeatsComponent
        currentSeats={orgBilling ? orgBilling.subscription.currentSeats : 0}
        errors={errors}
        formId={formId}
        updateOrganizationSeats={adminSeatAdjustmentHandler}
        includedSeats={orgBilling ? orgBilling.subscription.includedSeats : 0}
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
