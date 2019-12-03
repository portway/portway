import React from 'react'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import AdminNoticesComponent from './AdminNoticesComponent'

const AdminNoticesContainer = () => {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())
  const { data: orgBilling } = useDataService(dataMapper.organizations.billing(), [currentOrg.plan])

  return (
    <AdminNoticesComponent
      organization={currentOrg}
      subscription={orgBilling ? orgBilling.subscription : null}
    />
  )
}

export default AdminNoticesContainer
