import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { ORGANIZATION_ROLE_NAMES } from 'Shared/constants'
import Table from 'Components/Table/Table'

const AdminUsersComponent = ({ users }) => {
  const userHeadings = {
    name: { label: 'Name', sortable: true },
    role: { label: 'Role', sortable: true },
    createdAt: { label: 'Added', sortable: true },
    tools: { label: '' }
  }

  function renderTools(user) {
    return (
      <div className="table__tools">
        <a href={`mailto:${user.email}`} className="link link--gray">Email</a>
        <button className="btn btn--blank btn--danger">Remove</button>
      </div>
    )
  }

  // Create a nice user row object
  const userRows = {}
  Object.values(users).forEach((user) => {
    userRows[user.id] = [
      <a href={`mailto:${user.email}`} key={`email${user.id}`}>{user.name}</a>,
      ORGANIZATION_ROLE_NAMES[user.orgRoleId],
      moment(user.createdAt).format('YYYY MMM DD'),
      renderTools(user)
    ]
  })

  return (
    <div>
      <section>
        <header className="header header--with-button">
          <h2>User Management</h2>
          <button className="btn">Add User</button>
        </header>
        <Table headings={userHeadings} rows={userRows} />
      </section>
    </div>
  )
}

AdminUsersComponent.propTypes = {
  users: PropTypes.object.isRequired
}

export default AdminUsersComponent
