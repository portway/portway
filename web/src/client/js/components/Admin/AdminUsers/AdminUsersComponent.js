import React from 'react'
import PropTypes from 'prop-types'

import { UserIcon } from 'Components/Icons'
import ToolbarComponent from 'Components/Toolbar/ToolbarComponent'
import Table from 'Components/Table/Table'

const AdminUsersComponent = ({ users }) => {
  const toolbarAction = {
    callback: () => {},
    icon: <UserIcon />,
    label: 'Add User',
    title: 'Add a new user',
  }

  const userHeadings = {
    name: { label: 'Name', sortable: true },
    email: { label: 'Email', sortable: false },
    role: { label: 'Role', sortable: true },
    createdAt: { label: 'Added', sortable: true }
  }

  // Create a nice user row object
  const userRows = {}
  Object.values(users).forEach((user) => {
    userRows[user.id] = [
      user.name,
      user.email,
      user.orgRoleId,
      user.createdAt
    ]
  })

  return (
    <div>
      <section>
        <h2>User Management</h2>
        <ToolbarComponent action={toolbarAction} filter sort />
        <Table headings={userHeadings} rows={userRows} />
      </section>
    </div>
  )
}

AdminUsersComponent.propTypes = {
  users: PropTypes.object.isRequired
}

export default AdminUsersComponent
