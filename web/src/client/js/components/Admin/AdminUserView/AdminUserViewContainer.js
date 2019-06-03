import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { PRODUCT_NAME } from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import { ORGANIZATION_ROLE_IDS } from 'Shared/constants'
import { updateUserRole } from 'Actions/user'
import AdminUserViewComponent from './AdminUserViewComponent'

const AdminUserViewContainer = ({ match, updateUserRole }) => {
  const paramUser = {
    id: null,
    name: '',
    orgRoleId: ORGANIZATION_ROLE_IDS.USER
  }
  const { data: users } = useDataService(dataMapper.users.list())
  const userFromRoute = users[match.params.subSection] ? users[match.params.subSection] : paramUser
  const { data: userProjects } = useDataService(dataMapper.projects.listForUser(userFromRoute.id))
  if (!users || !userFromRoute) return null

  function roleChangeHandler(value) {
    updateUserRole(userFromRoute.id, value)
  }

  return (
    <>
      <Helmet>
        <title>Admin: {userFromRoute.name} – {PRODUCT_NAME}</title>
      </Helmet>
      <AdminUserViewComponent userProjects={userProjects} roleChangeHandler={roleChangeHandler} user={userFromRoute} />
    </>
  )
}

AdminUserViewContainer.propTypes = {
  match: PropTypes.object.isRequired,
  updateUserRole: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = { updateUserRole }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminUserViewContainer)
)
