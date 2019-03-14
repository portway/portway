import React from 'react'

import Header from './Header'

import useDataService from 'Hooks/useDataService'
import dataMapper from '../../libs/dataMapper'
import currentUserId from '../../libs/currentUserId'

function HeaderContainer(props) {
  const { data } = useDataService(dataMapper.users.id(currentUserId))
  console.log(data)

  return <Header />
}

export default HeaderContainer
