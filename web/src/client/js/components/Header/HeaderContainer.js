import React from 'react'

import Header from './Header'

import useDataService from 'Hooks/useDataService'
import dataMapper from '../../libs/dataMapper'
import currentUserId from '../../libs/currentUserId'

function HeaderContainer(props) {
  const { data: currentUser } = useDataService(dataMapper.users.id(currentUserId))

  return <Header currentUser={currentUser} />
}

export default HeaderContainer
