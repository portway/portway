import React from 'react'
import PropTypes from 'prop-types'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import UserSecurityComponent from './UserSecurityComponent'

const UserSecurityContainer = () => {
  const { data: currentUser } = useDataService(dataMapper.users.current())
  if (!currentUser) return null
  return <UserSecurityComponent user={currentUser} />
}

UserSecurityContainer.propTypes = {
}

export default UserSecurityContainer
