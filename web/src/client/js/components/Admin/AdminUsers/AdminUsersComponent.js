import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { ORGANIZATION_ROLE_NAMES } from 'Shared/constants'
import Table from 'Components/Table/Table'
import AdminUsersCreateForm from './AdminUsersCreateForm'

const AdminUsersComponent = ({ addUserHandler, errors, isCreating, setCreateMode, users }) => {
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
      user.name,
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
          <button className="btn" disabled={isCreating} onClick={() => { setCreateMode(true) }}>Add User</button>
        </header>
        {isCreating &&
          <AdminUsersCreateForm
            cancelHandler={() => {setCreateMode(false) }}
            errors={errors}
            submitHandler={addUserHandler}
          />
        }
        <Table headings={userHeadings} rows={userRows} />
      </section>
    </div>
  )
}

AdminUsersComponent.propTypes = {
  addUserHandler: PropTypes.func,
  errors: PropTypes.object,
  isCreating: PropTypes.bool.isRequired,
  setCreateMode: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired
}

export default AdminUsersComponent
