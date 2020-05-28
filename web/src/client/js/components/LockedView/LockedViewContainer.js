import React from 'react'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import LockedViewComponent from './LockedViewComponent'

const LockedViewContainer = () => {
  const { data: currentUser } = useDataService(dataMapper.users.current())
  const { data: currentOrg = {} } = useDataService(dataMapper.organizations.current())

  return (
    <LockedViewComponent
      userRole={currentUser.orgRoleId}
      organization={currentOrg}
    />
  )
}

export default LockedViewContainer
