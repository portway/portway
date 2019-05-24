import React from 'react'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import AdminUsersComponent from './AdminUsersComponent'

const AdminUsersContainer = () => {
  const { data: users } = useDataService(dataMapper.users.list())
  return <AdminUsersComponent users={users} />
}

export default AdminUsersContainer
