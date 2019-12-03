import React from 'react'

import Store from '../../../reducers'
import { logoutUser } from 'Actions/user'
import { currentUserId } from 'Libs/currentIds'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import AdminNoticesComponent from './AdminNoticesComponent'

const AdminNoticesContainer = () => {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())
  const { data: orgBilling } = useDataService(dataMapper.organizations.billing(), [currentOrg.plan])

  function logoutAction() {
    Store.dispatch(logoutUser(currentUserId))
  }

  return (
    <AdminNoticesComponent
      logoutAction={logoutAction}
      organization={currentOrg}
      subscription={orgBilling ? orgBilling.subscription : null}
    />
  )
}

export default AdminNoticesContainer
