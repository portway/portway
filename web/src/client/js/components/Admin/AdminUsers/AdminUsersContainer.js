import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { currentUserId } from 'Libs/currentIds'

import { PRODUCT_NAME, QUERY_PARAMS } from 'Shared/constants'
import { createUser, reinviteUser, removeUser } from 'Actions/user'
import { uiCreateUserMode, uiConfirm } from 'Actions/ui'
import AdminUsersComponent from './AdminUsersComponent'

const AdminUsersContainer = ({
  createUser,
  errors,
  history,
  isCreating,
  isInviting,
  reinviteUser,
  removeUser,
  uiConfirm,
  uiCreateUserMode
}) => {
  const { data: users } = useDataService(dataMapper.users.list())
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortMethod, setSortMethod] = useState(QUERY_PARAMS.ASCENDING)

  // Update the params on state change
  useEffect(() => {
    history.push({ search: `?sortBy=${sortBy}&sortMethod=${sortMethod}` })
    // @todo handle the sort action here, but not on the first load? that should
    // already be the default
  }, [history, sortBy, sortMethod])

  function addUserHandler(values) {
    createUser(values)
  }

  function reinviteUserHandler(userId) {
    reinviteUser(userId)
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
      sortMethod === QUERY_PARAMS.ASCENDING ?
        setSortMethod(QUERY_PARAMS.DESCENDING) : setSortMethod(QUERY_PARAMS.ASCENDING)
      return
    }
    setSortBy(id)
    setSortMethod(QUERY_PARAMS.ASCENDING)
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
        isInviting={isInviting}
        errors={errors}
        reinviteUserHandler={reinviteUserHandler}
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
  isInviting: PropTypes.bool.isRequired,
  createUser: PropTypes.func.isRequired,
  errors: PropTypes.object,
  reinviteUser: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
  uiCreateUserMode: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.user,
    isCreating: state.ui.users.creating,
    isInviting: state.ui.users.inviting
  }
}

const mapDispatchToProps = { createUser, reinviteUser, removeUser, uiCreateUserMode, uiConfirm }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminUsersContainer)
)
