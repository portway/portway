import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { ORGANIZATION_ROLE_IDS, PATH_PROJECTS, PRODUCT_NAME } from 'Shared/constants'
import { deleteOrganization } from 'Actions/organization'
import { uiConfirm } from 'Actions/ui'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import OrgPermission from 'Components/Permission/OrgPermission'
import AdminBillingComponent from './AdminBillingComponent'

const AdminBillingContainer = ({ deleteOrganization, uiConfirm }) => {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())
  const { data: orgBilling } = useDataService(dataMapper.organizations.billing(), [currentOrg.plan])

  function deleteAccountHander() {
    const message = (
      <>
        <p className="danger">Delete your account entirely?</p>
        <ul>
          <li>You will be able to log in for the next X days to undo this account.</li>
          <li>After X days, your account and all users associated with it will be removed.</li>
          <li>After X days, all of your projects and documents will be removed.</li>
        </ul>
      </>
    )
    const confirmedAction = () => {
      deleteOrganization(currentOrg.id)
    }
    const confirmedLabel = 'Yes, I understand'
    const confirmedText = currentOrg.name
    uiConfirm({ message, confirmedAction, confirmedLabel, confirmedText })
  }

  return (
    <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<Redirect to={PATH_PROJECTS} />}>
      <Helmet>
        <title>Account Settings: Billing – {PRODUCT_NAME}</title>
      </Helmet>
      <AdminBillingComponent orgBilling={orgBilling} organization={currentOrg} deleteAccountHander={deleteAccountHander} />
    </OrgPermission>
  )
}

AdminBillingContainer.propTypes = {
  deleteOrganization: PropTypes.func,
  uiConfirm: PropTypes.func,
}

const mapDispatchToProps = { deleteOrganization, uiConfirm }

export default connect(null, mapDispatchToProps)(AdminBillingContainer)
