import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { ORGANIZATION_ROLE_NAMES, PATH_ADMIN } from 'Shared/constants'
import { TrashIcon } from 'Components/Icons'
import Table from 'Components/Table/Table'
import AdminUsersCreateForm from './AdminUsersCreateForm'

const AdminUsersComponent = ({
  addUserHandler,
  currentUserId,
  errors,
  isCreating,
  removeUserHandler,
  setCreateMode,
  sortBy,
  sortMethod,
  sortUsersHandler,
  users
}) => {
  const userHeadings = {
    name: { label: 'Name', sortable: true },
    role: { label: 'Role' },
    createdAt: { label: 'Added', sortable: true },
    tools: { label: '' }
  }

  function renderTools(user) {
    if (user.id === currentUserId) return null
    return (
      <div className="table__tools">
        <button
          className="btn btn--blank btn--with-circular-icon"
          onClick={() => { removeUserHandler(user.id) }}>
          <TrashIcon />
        </button>
      </div>
    )
  }

  // Create a nice user row object
  const userRows = {}
  Object.values(users).forEach((user) => {
    userRows[user.id] = [
      <Link to={`${PATH_ADMIN}/user/${user.id}`} key={user.id}>{user.name}</Link>,
      ORGANIZATION_ROLE_NAMES[user.orgRoleId],
      user.pending ? <span className="pill pill--highlight">Pending</span> : moment(user.createdAt).format('YYYY MMM DD'),
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
        {!isCreating &&
          <Table headings={userHeadings} rows={userRows} sortedBy={sortBy} sortMethod={sortMethod} sortCallback={sortUsersHandler} />
        }
      </section>
    </div>
  )
}

AdminUsersComponent.propTypes = {
  addUserHandler: PropTypes.func,
  currentUserId: PropTypes.number.isRequired,
  errors: PropTypes.object,
  isCreating: PropTypes.bool.isRequired,
  removeUserHandler: PropTypes.func,
  setCreateMode: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortMethod: PropTypes.string.isRequired,
  sortUsersHandler: PropTypes.func,
  users: PropTypes.object.isRequired
}

export default AdminUsersComponent
