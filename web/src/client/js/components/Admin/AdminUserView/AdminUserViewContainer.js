import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import AdminUserViewComponent from './AdminUserViewComponent'

const AdminUserViewContainer = ({ match }) => {
  const { data: users } = useDataService(dataMapper.users.list())
  if (!users) return null

  const userFromRoute = users[match.params.subSection]
  if (!userFromRoute) return null

  return <AdminUserViewComponent user={userFromRoute} />
}

AdminUserViewContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(AdminUserViewContainer)
