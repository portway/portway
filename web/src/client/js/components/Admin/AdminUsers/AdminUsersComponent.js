import React from 'react'
import PropTypes from 'prop-types'

import { UserIcon } from 'Components/Icons'
import ToolbarComponent from 'Components/Toolbar/ToolbarComponent'

const AdminUsersComponent = ({ users }) => {
  console.log(users)
  const toolbarAction = {
    callback: () => {},
    icon: <UserIcon />,
    label: 'Add User',
    title: 'Add a new user',
  }
  return (
    <div>
      <section>
        <h2>User Management</h2>
        <ToolbarComponent action={toolbarAction} filter sort />
      </section>
    </div>
  )
}

AdminUsersComponent.propTypes = {
  users: PropTypes.object.isRequired
}

export default AdminUsersComponent
