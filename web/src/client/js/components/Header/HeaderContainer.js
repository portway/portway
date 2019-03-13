import React from 'react'

import dataMapper from '../../libs/dataMapper'
import useDataService from '../../hooks/useDataService'

import ProjectsListItem from './Header'

function  HeaderContainer(props) {
  const { data: users } = useDataService(dataMapper.users.list())

  return (
    <Header users={users} />
  )
}

export default HeaderContainer
