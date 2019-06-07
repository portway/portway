import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { currentUserId } from 'Libs/currentIds'

import { PRODUCT_NAME } from 'Shared/constants'
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

  function pageChangeHandler(page) {
    // @todo trigger fetch
    console.info('Change page', page)
  }

  function setCreateMode(value) {
    uiCreateUserMode(value)
  }

  return (
    <>
      <Helmet>
        <title>Admin: Users – {PRODUCT_NAME}</title>
      </Helmet>
      <AdminUsersComponent
        addUserHandler={addUserHandler}
        currentUserId={currentUserId}
        isCreating={isCreating}
        errors={errors}
        pageChangeHandler={pageChangeHandler}
        removeUserHandler={removeUserHandler}
        setCreateMode={setCreateMode}
        users={users}
      />
    </>
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
