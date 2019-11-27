import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import { updatePassword } from 'Actions/user'
import UserSecurityComponent from './UserSecurityComponent'

const UserSecurityContainer = ({ errors, forms, updatePassword }) => {
  const { data: currentUser } = useDataService(dataMapper.users.current())

  const userPasswordFormId = 'user-password'

  function submitHandler(values) {
    updatePassword(userPasswordFormId, currentUser.id, {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword
    })
  }

  if (!currentUser) return null
  return (
    <UserSecurityComponent
      errors={errors}
      formId={userPasswordFormId}
      submitHandler={submitHandler}
      succeeded={forms[userPasswordFormId] ? forms[userPasswordFormId].succeeded : null}
      user={currentUser}
    />
  )
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.user,
    forms: state.forms.byName
  }
}

const mapDispatchToProps = { updatePassword }

UserSecurityContainer.propTypes = {
  errors: PropTypes.object,
  forms: PropTypes.object.isRequired,
  updatePassword: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSecurityContainer)
