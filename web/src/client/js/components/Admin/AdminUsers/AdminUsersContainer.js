import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { currentUserId } from 'Libs/currentIds'

import { PRODUCT_NAME } from 'Shared/constants'
import { createUser, removeUser } from 'Actions/user'
import { uiCreateUserMode, uiConfirm } from 'Actions/ui'
import AdminUsersComponent from './AdminUsersComponent'

const AdminUsersContainer = ({ history, isCreating, createUser, errors, removeUser, uiCreateUserMode, uiConfirm }) => {
  const { data: users } = useDataService(dataMapper.users.list())
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortMethod, setSortMethod] = useState('ASC')

  // Update the params on state change
  useEffect(() => {
    history.push({ search: `?sortBy=${sortBy}&sortMethod=${sortMethod}` })
  }, [history, sortBy, sortMethod])

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

  function sortUsersHandler(id) {
    if (sortBy === id) {
      sortMethod === 'ASC' ? setSortMethod('DESC') : setSortMethod('ASC')
      return
    }
    setSortBy(id)
    setSortMethod('ASC')
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
        removeUserHandler={removeUserHandler}
        setCreateMode={setCreateMode}
        sortBy={sortBy}
        sortMethod={sortMethod}
        sortUsersHandler={sortUsersHandler}
        users={users}
      />
    </>
  )
}

AdminUsersContainer.propTypes = {
  history: PropTypes.object.isRequired,
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminUsersContainer)
)
