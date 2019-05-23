import React from 'react'
import PropTypes from 'prop-types'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import UserProfileComponent from './UserProfileComponent'

const UserProfileContainer = () => {
  const { data: currentUser } = useDataService(dataMapper.users.current())

  function submitHandler(values) {
    console.log(values)
  }

  return <UserProfileComponent user={currentUser} submitHandler={submitHandler} />
}

UserProfileContainer.propTypes = {
}

export default UserProfileContainer
