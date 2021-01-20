import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { currentUserId } from 'Libs/currentIds'
import {
  PATH_ORGANIZATION,
  PRODUCT_NAME,
  QUERY_PARAMS,
  MULTI_USER_PLAN_TYPES,
  ORG_SUBSCRIPTION_STATUS
} from 'Shared/constants'
import { parseParams } from 'Utilities/queryParams'
import { debounce } from 'Shared/utilities'

import { createUser, reinviteUser, removeUser, sortUsers } from 'Actions/user'
import { formResetAction } from 'Actions/form'
import { uiCreateUserMode, uiConfirm } from 'Actions/ui'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import AdminUsersComponent from './AdminUsersComponent'

const AdminUsersContainer = ({
  createUser,
  errors,
  formResetAction,
  history,
  isCreating,
  isInviting,
  reinviteUser,
  removeUser,
  sortUsers,
  uiConfirm,
  uiCreateUserMode,
}) => {
  const params = parseParams(location.search)
  const [searchTerm, setSearchTerm] = useState(null)
  const { page = 1, sortBy = 'createdAt', sortMethod = QUERY_PARAMS.DESCENDING } = params

  useEffect(() => {
    sortUsers(sortBy, sortMethod)
  }, [sortBy, sortMethod, sortUsers])

  const { data: { users = [], totalPages } } = useDataService(dataMapper.users.list(page, sortBy, sortMethod), [page, sortBy, sortMethod])

  const { data: { userSearchResults = [], totalSearchPages } } = useDataService(dataMapper.users.searchByName(searchTerm), [searchTerm])
  // setting `null` as the second arg to useDataService will force seats to reload whenever
  // another action clears out seat data (eg adding/removing users)
  const { data: seats } = useDataService(dataMapper.organizations.seats(), null)


  const formId = 'user-create-form'

  function addUserHandler(values) {
    createUser(formId, values)
  }

  function cancelUserHandler() {
    formResetAction(formId)
  }

  function reinviteUserHandler(userId) {
    reinviteUser(userId)
  }

  function removeUserHandler(userId) {
    const user = users.find(user => user.id === userId)
    const message = (
      <span>Delete <span className="highlight danger">{user.name}</span>?</span>
    )
    const options = {
      confirmedAction: () => { removeUser(userId) },
      confirmedLabel: 'Yes, delete this user',
      theme: 'danger'
    }
    uiConfirm({ message, options })
  }

  function sortUsersHandler(selectedSortProperty) {
    let newSortMethod
    if (sortBy === selectedSortProperty && sortMethod === QUERY_PARAMS.ASCENDING) {
      newSortMethod = QUERY_PARAMS.DESCENDING
    } else {
      newSortMethod = QUERY_PARAMS.ASCENDING
    }

    history.push({ search: `?sortBy=${selectedSortProperty}&sortMethod=${newSortMethod}&page=${page}` })
  }

  const searchUsersByName = debounce(500, (value) => {
    setSearchTerm(value)
  })

  function setCreateMode(value) {
    uiCreateUserMode(value)
  }

  return (
    <OrgPlanPermission
      acceptedPlans={MULTI_USER_PLAN_TYPES}
      acceptedSubscriptionStatuses={[ORG_SUBSCRIPTION_STATUS.ACTIVE, ORG_SUBSCRIPTION_STATUS.TRIALING_PENDING_ACTIVE]}
      elseRender={<Redirect to={PATH_ORGANIZATION} />}>
      <Helmet>
        <title>Admin: Users – {PRODUCT_NAME}</title>
      </Helmet>
      <AdminUsersComponent
        addUserHandler={addUserHandler}
        cancelUserAddHandler={cancelUserHandler}
        currentUserId={currentUserId}
        errors={errors}
        formId={formId}
        isCreating={isCreating}
        isInviting={isInviting}
        isSearching={searchTerm}
        reinviteUserHandler={reinviteUserHandler}
        removeUserHandler={removeUserHandler}
        searchUsersHandler={searchUsersByName}
        setCreateMode={setCreateMode}
        sortBy={sortBy}
        sortMethod={sortMethod}
        sortUsersHandler={sortUsersHandler}
        seats={seats}
        totalPages={searchTerm && userSearchResults ? totalSearchPages : totalPages}
        users={searchTerm && userSearchResults ? userSearchResults : users}
      />
    </OrgPlanPermission>
  )
}

AdminUsersContainer.propTypes = {
  formResetAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isCreating: PropTypes.bool.isRequired,
  isInviting: PropTypes.bool.isRequired,
  createUser: PropTypes.func.isRequired,
  errors: PropTypes.object,
  reinviteUser: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
  sortUsers: PropTypes.func.isRequired,
  uiCreateUserMode: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired,
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
  formResetAction,
  reinviteUser,
  removeUser,
  sortUsers,
  uiCreateUserMode,
  uiConfirm
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminUsersContainer)
)
