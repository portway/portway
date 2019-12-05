import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { currentUserId } from 'Libs/currentIds'
import {
  PATH_ORGANIZATION,
  PRODUCT_NAME,
  PLAN_TYPES,
  QUERY_PARAMS,
  MULTI_USER_PLAN_TYPES
} from 'Shared/constants'
import { parseParams } from 'Utilities/queryParams'

import { createUser, reinviteUser, removeUser, sortUsers } from 'Actions/user'
import { uiCreateUserMode, uiConfirm } from 'Actions/ui'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import AdminUsersComponent from './AdminUsersComponent'

const AdminUsersContainer = ({
  createUser,
  errors,
  history,
  isCreating,
  isInviting,
  reinviteUser,
  removeUser,
  sortUsers,
  uiConfirm,
  uiCreateUserMode
}) => {
  const params = parseParams(location.search)
  const { page = 1, sortBy = 'createdAt', sortMethod = QUERY_PARAMS.ASCENDING } = params
  const { data: { users = [], totalPages } } = useDataService(dataMapper.users.list(page, sortBy, sortMethod), [page, sortBy, sortMethod])
  const { data: orgBilling } = useDataService(dataMapper.organizations.billing())

  function addUserHandler(values) {
    createUser(values)
  }

  function reinviteUserHandler(userId) {
    reinviteUser(userId)
  }

  function removeUserHandler(userId) {
    const user = users.find(user => user.id === userId)
    const message = (
      <span>Delete <span className="highlight danger">{user.name}</span>?</span>
    )
    const confirmedAction = () => { removeUser(userId) }
    const confirmedLabel = 'Yes, delete this user'
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }

  function pageChangeHandler(page) {
    // @todo trigger fetch
    console.info('Change page', page)
  }

  function sortUsersHandler(selectedSortProperty) {
    let newSortMethod
    if (sortBy === selectedSortProperty && sortMethod === QUERY_PARAMS.ASCENDING) {
      newSortMethod = QUERY_PARAMS.DESCENDING
    } else {
      newSortMethod = QUERY_PARAMS.ASCENDING
    }

    history.push({ search: `?sortBy=${selectedSortProperty}&sortMethod=${newSortMethod}&page=${page}` })
    sortUsers(sortBy, sortMethod)
  }

  function setCreateMode(value) {
    uiCreateUserMode(value)
  }

  return (
    <OrgPlanPermission
      acceptedPlans={MULTI_USER_PLAN_TYPES}
      elseRender={<Redirect to={PATH_ORGANIZATION} />}>
      <Helmet>
        <title>Admin: Users – {PRODUCT_NAME}</title>
      </Helmet>
      <AdminUsersComponent
        addUserHandler={addUserHandler}
        currentUserId={currentUserId}
        errors={errors}
        isCreating={isCreating}
        isInviting={isInviting}
        pageChangeHandler={pageChangeHandler}
        reinviteUserHandler={reinviteUserHandler}
        removeUserHandler={removeUserHandler}
        setCreateMode={setCreateMode}
        sortBy={sortBy}
        sortMethod={sortMethod}
        sortUsersHandler={sortUsersHandler}
        subscription={orgBilling ? orgBilling.subscription : null}
        totalPages={totalPages}
        users={users}
      />
    </OrgPlanPermission>
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
  sortUsers: PropTypes.func.isRequired,
  uiCreateUserMode: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    errors: state.validation.user,
    isCreating: state.ui.users.creating,
    isInviting: state.ui.users.inviting,
  }
}

const mapDispatchToProps = {
  createUser,
  reinviteUser,
  removeUser,
  sortUsers,
  uiCreateUserMode,
  uiConfirm
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminUsersContainer)
)
