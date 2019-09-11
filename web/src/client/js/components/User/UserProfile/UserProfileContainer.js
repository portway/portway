import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { updateUser } from 'Actions/user'
import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import UserProfileComponent from './UserProfileComponent'

const UserProfileContainer = ({ errors, updateUser }) => {
  const { data: currentUser } = useDataService(dataMapper.users.current())

  function submitHandler(values) {
    console.log(values)
    updateUser(currentUser.id, values)
  }

  return <UserProfileComponent errors={errors} user={currentUser} submitHandler={submitHandler} />
}

UserProfileContainer.propTypes = {
  errors: PropTypes.object,
  updateUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.user
  }
}

const mapDispatchToProps = { updateUser }

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileContainer)
