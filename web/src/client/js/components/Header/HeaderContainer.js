import React from 'react'

import dataMapper from '../../libs/dataMapper'
import useDataService from '../../hooks/useDataService'

import Header from './Header'

function  HeaderContainer(props) {
  //TODO fetch current user instead of all users
  const { data: users } = useDataService(dataMapper.users.list())

  return (
    <Header currentUser={Object.values(users)[0]} />
  )
}

export default HeaderContainer
