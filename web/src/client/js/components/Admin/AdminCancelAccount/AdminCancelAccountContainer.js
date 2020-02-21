import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'

import { ORGANIZATION_ROLE_IDS, TRIALING_STATUSES } from 'Shared/constants'
import { deleteOrganization } from 'Actions/organization'
import { uiConfirm } from 'Actions/ui'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import OrgPermission from 'Components/Permission/OrgPermission'

import AdminCancelAccountComponent from './AdminCancelAccountComponent'

const AdminCancelAccountContainer = ({ deleteOrganization, uiConfirm }) => {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())
  const { data: orgBilling } = useDataService(dataMapper.organizations.billing(), [currentOrg.plan])

  if (!orgBilling || !currentOrg) return null

  let remainingDays
  if (orgBilling && orgBilling.subscription) {
    const periodEnd = moment.unix(orgBilling.subscription.currentPeriodEnd)
    const today = moment()
    remainingDays = periodEnd.diff(today, 'days')
  }

  const trialingMessage = (
    <>
      <p className="danger">Cancel your trial account?</p>
      <p>The following actions will happen <b>immediately</b>:</p>
      <ul>
        <li>All projects and documents you have created will be removed.</li>
        <li>All of your personal information will be removed.</li>
      </ul>
    </>
  )

  const paidCustomerMessage = (
    <>
      <p className="danger">Delete your account entirely?</p>
      <ul>
        <li>You will be able to log in for the next <b>{remainingDays} days</b> to undo this account.</li>
        <li>After <b>{remainingDays} days</b>, your account and all users associated with it will be removed.</li>
        <li>After <b>{remainingDays} days</b>, all of your projects and documents will be removed.</li>
      </ul>
    </>
  )

  function deleteAccountHander() {
    const message = TRIALING_STATUSES.includes(currentOrg.subscriptionStatus) ? trialingMessage : paidCustomerMessage
    const options = {
      confirmedAction: () => { deleteOrganization(currentOrg.id) },
      confirmedLabel: 'Yes, cancel my account',
      confirmedText: currentOrg.name,
      theme: 'danger'
    }
    uiConfirm({ message, options })
  }

  return (
    <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]}>
      <AdminCancelAccountComponent deleteAccountHandler={deleteAccountHander} />
    </OrgPermission>
  )
}

AdminCancelAccountContainer.propTypes = {
  deleteOrganization: PropTypes.func,
  uiConfirm: PropTypes.func,
}

const mapDispatchToProps = { deleteOrganization, uiConfirm }

export default connect(null, mapDispatchToProps)(AdminCancelAccountContainer)
