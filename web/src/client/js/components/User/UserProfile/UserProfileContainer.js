import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { updateUser, updateUserAvatar } from 'Actions/user'
import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import UserProfileComponent from './UserProfileComponent'
import UserAvatarComponent from './UserAvatarComponent'

const UserProfileContainer = ({ errors, updateUser, updateUserAvatar }) => {
  const { data: currentUser } = useDataService(dataMapper.users.current())

  const userProfileId = 'user-profile'
  const userAvatarId = 'user-avatar'

  function submitHandler(values) {
    // if (values.name === null) values.name = currentUser.name
    // if (values.email === null) values.email = currentUser.email
    updateUser(userProfileId, currentUser.id, {
      name: values.name,
      email: values.email
    })
  }

  function avatarUpdateHandler(value) {
    updateUserAvatar(userAvatarId, currentUser.id, value.avatar)
  }

  return (
    <>
      <UserProfileComponent
        errors={errors}
        formId={userProfileId}
        submitHandler={submitHandler}
        user={currentUser}
      />
      <hr />
      <UserAvatarComponent
        errors={errors}
        formId={userAvatarId}
        submitHandler={avatarUpdateHandler}
        user={currentUser}
      />
    </>
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
