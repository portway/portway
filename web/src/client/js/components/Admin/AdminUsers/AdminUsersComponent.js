import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { ORGANIZATION_ROLE_NAMES, PATH_ADMIN } from 'Shared/constants'
import { TrashIcon } from 'Components/Icons'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'
import Table from 'Components/Table/Table'
import AdminUsersCreateForm from './AdminUsersCreateForm'

import './_AdminUsers.scss'

const AdminUsersComponent = ({
  addUserHandler,
  currentUserId,
  errors,
  isCreating,
  isInviting,
  reinviteUserHandler,
  removeUserHandler,
  setCreateMode,
  users
}) => {
  const userHeadings = {
    name: { label: 'Name', sortable: true },
    role: { label: 'Role', sortable: true },
    createdAt: { label: 'Added', sortable: true },
    tools: { label: '' }
  }

  function renderTools(userId) {
    if (userId === currentUserId) return null
    return (
      <div className="table__tools">
        <button
          className="btn btn--blank btn--with-circular-icon"
          onClick={() => { removeUserHandler(userId) }}>
          <TrashIcon />
        </button>
      </div>
    )
  }

  function renderPendingUser(userId) {
    return (
      <div className="admin-users__pending-container">
        <span className="pill pill--highlight">Pending</span>
        {isInviting &&
        <SpinnerComponent />
        }
        {!isInviting &&
        <button className="btn btn--like-a-link" onClick={() => reinviteUserHandler(userId)}>(Reinvite)</button>
        }
      </div>
    )
  }

  // Create a nice user row object
  const userRows = {}
  Object.values(users).forEach((user) => {
    userRows[user.id] = [
      <Link to={`${PATH_ADMIN}/user/${user.id}`} key={user.id}>{user.name}</Link>,
      ORGANIZATION_ROLE_NAMES[user.orgRoleId],
      user.pending ? renderPendingUser(user.id) : moment(user.createdAt).format('YYYY MMM DD'),
      renderTools(user.id)
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
          <Table headings={userHeadings} rows={userRows} />
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
  isInviting: PropTypes.bool.isRequired,
  reinviteUserHandler: PropTypes.func,
  removeUserHandler: PropTypes.func,
  setCreateMode: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired
}

export default AdminUsersComponent
