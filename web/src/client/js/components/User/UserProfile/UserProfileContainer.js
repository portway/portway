import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { updateUser, updateUserAvatar } from 'Actions/user'
import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import UserProfileComponent from './UserProfileComponent'

const UserProfileContainer = ({ errors, updateUser, updateUserAvatar }) => {
  const { data: currentUser, loading } = useDataService(dataMapper.users.current())

  function submitHandler(values) {
    if (values.email !== currentUser.email || values.name !== currentUser.name) {
      updateUser(currentUser.id, {
        name: values.name,
        email: values.email
      })
    }
    if (values.avatar !== undefined) {
      updateUserAvatar(currentUser.id, values.avatar)
    }
  }

  return (
    <UserProfileComponent
      errors={errors}
      loading={loading}
      submitHandler={submitHandler}
      user={currentUser}
    />
  )
}

UserProfileContainer.propTypes = {
  errors: PropTypes.object,
  updateUser: PropTypes.func.isRequired,
  updateUserAvatar: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.user
  }
}

const mapDispatchToProps = { updateUser, updateUserAvatar }

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileContainer)
