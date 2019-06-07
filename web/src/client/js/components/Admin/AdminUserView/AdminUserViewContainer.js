import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { PRODUCT_NAME } from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import { updateUserRole } from 'Actions/user'
import { removeProjectAssignee, updateProjectAssignee } from 'Actions/project'
import { uiConfirm } from 'Actions/ui'
import AdminUserViewComponent from './AdminUserViewComponent'

const AdminUserViewContainer = ({ match, removeProjectAssignee, updateProjectAssignee, updateUserRole, uiConfirm }) => {
  const { data: users } = useDataService(dataMapper.users.list())
  const { data: userFromRoute = {} } = useDataService(dataMapper.users.id(match.params.subSection))
  const { data: userProjects } = useDataService(dataMapper.projects.listForUser(userFromRoute.id), [userFromRoute])
  const { data: projectAssignments } = useDataService(dataMapper.users.projectAssignmentsForUser(userFromRoute.id), [userFromRoute])
  if (!users || !userFromRoute) return null

  function roleChangeHandler(value) {
    updateUserRole(userFromRoute.id, value)
  }

  function projectRoleChangeHandler(projectId, assignmentId, value) {
    updateProjectAssignee(projectId, assignmentId, { roleId: value })
  }

  function removeProjectHandler(projectId, assignmentId) {
    const message = <span>Remove <span className="highlight">{userFromRoute.name}</span> from this project?</span>
    const confirmedAction = () => { return removeProjectAssignee(projectId, userFromRoute.id, assignmentId) }
    const confirmedLabel = `Yes`
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }

  return (
    <>
      <Helmet>
        <title>Admin: {userFromRoute.name} – {PRODUCT_NAME}</title>
      </Helmet>
      <AdminUserViewComponent
        projectAssignments={projectAssignments}
        projectRoleChangeHandler={projectRoleChangeHandler}
        removeProjectHandler={removeProjectHandler}
        roleChangeHandler={roleChangeHandler}
        userProjects={userProjects}
        user={userFromRoute} />
    </>
  )
}

AdminUserViewContainer.propTypes = {
  match: PropTypes.object.isRequired,
  removeProjectAssignee: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired,
  updateProjectAssignee: PropTypes.func.isRequired,
  updateUserRole: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = { removeProjectAssignee, updateProjectAssignee, updateUserRole, uiConfirm }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminUserViewContainer)
)
