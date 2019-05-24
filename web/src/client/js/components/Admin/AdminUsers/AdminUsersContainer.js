import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import { createUser } from 'Actions/user'
import { uiCreateUserMode } from 'Actions/ui'
import AdminUsersComponent from './AdminUsersComponent'

const AdminUsersContainer = ({ isCreating, createUser, errors, uiCreateUserMode }) => {
  const { data: users } = useDataService(dataMapper.users.list())

  function addUserHandler(values) {
    createUser(values)
  }

  function setCreateMode(value) {
    uiCreateUserMode(value)
  }

  return (
    <AdminUsersComponent
      addUserHandler={addUserHandler}
      isCreating={isCreating}
      errors={errors}
      setCreateMode={setCreateMode}
      users={users}
    />
  )
}

AdminUsersContainer.propTypes = {
  isCreating: PropTypes.bool.isRequired,
  createUser: PropTypes.func.isRequired,
  errors: PropTypes.object,
  uiCreateUserMode: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.user,
    isCreating: state.ui.users.creating
  }
}

const mapDispatchToProps = { createUser, uiCreateUserMode }

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsersContainer)
