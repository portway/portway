import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { currentUserId } from 'Libs/currentIds'

import { createUser, removeUser } from 'Actions/user'
import { uiCreateUserMode, uiConfirm } from 'Actions/ui'
import AdminUsersComponent from './AdminUsersComponent'

const AdminUsersContainer = ({ isCreating, createUser, errors, removeUser, uiCreateUserMode, uiConfirm }) => {
  const { data: users } = useDataService(dataMapper.users.list())

  function addUserHandler(values) {
    createUser(values)
  }

  function removeUserHandler(userdId) {
    const message = (
      <span>Delete <span className="highlight danger">{users[userdId].name}</span>?</span>
    )
    const confirmedAction = () => { removeUser(userdId) }
    const confirmedLabel = 'Yes, delete this user'
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }

  function setCreateMode(value) {
    uiCreateUserMode(value)
  }

  return (
    <AdminUsersComponent
      addUserHandler={addUserHandler}
      currentUserId={currentUserId}
      isCreating={isCreating}
      errors={errors}
      removeUserHandler={removeUserHandler}
      setCreateMode={setCreateMode}
      users={users}
    />
  )
}

AdminUsersContainer.propTypes = {
  isCreating: PropTypes.bool.isRequired,
  createUser: PropTypes.func.isRequired,
  errors: PropTypes.object,
  removeUser: PropTypes.func.isRequired,
  uiCreateUserMode: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.user,
    isCreating: state.ui.users.creating
  }
}

const mapDispatchToProps = { createUser, removeUser, uiCreateUserMode, uiConfirm }

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsersContainer)
