import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { ORGANIZATION_ROLE_NAMES, ORGANIZATION_ROLE_IDS, PATH_ADMIN, PATH_BILLING } from 'Shared/constants'
import { TrashIcon } from 'Components/Icons'
import OrgPermission from 'Components/Permission/OrgPermission'
import AdminUsersCreateForm from './AdminUsersCreateForm'
import PaginatorContainer from 'Components/Paginator/PaginatorContainer'
import SpinnerContainer from 'Components/Spinner/SpinnerContainer'
import Table from 'Components/Table/Table'
import FormField from 'Components/Form/FormField'

import './_AdminUsers.scss'

const AdminUsersComponent = ({
  addUserHandler,
  currentUserId,
  errors,
  isCreating,
  isInviting,
  isSearching,
  reinviteUserHandler,
  removeUserHandler,
  searchUsersHandler,
  setCreateMode,
  sortBy,
  sortMethod,
  sortUsersHandler,
  seats,
  users,
  totalPages
}) => {
  const searchFieldRef = useRef()

  const userHeadings = {
    name: { label: 'Name', sortable: true },
    role: { label: 'Role' },
    createdAt: { label: 'Added', sortable: true },
    tools: { label: '' }
  }

  const gray20 = getComputedStyle(document.documentElement).getPropertyValue('--color-gray-20')

  function renderTools(userId) {
    return (
      <div className="table__tools">
        <SpinnerContainer color={gray20} />
        {userId !== currentUserId &&
        <button
          aria-label="Remove user"
          className="btn btn--blank btn--with-circular-icon"
          onClick={() => { removeUserHandler(userId) }}>
          <TrashIcon />
        </button>
        }
      </div>
    )
  }

  function renderPendingUser(userId) {
    return (
      <div className="admin-users__pending-container">
        <span className="pill pill--highlight">Pending</span>
        {!isInviting &&
        <button className="btn btn--like-a-link" onClick={() => reinviteUserHandler(userId)}>(Reinvite)</button>
        }
      </div>
    )
  }

  // Create a nice user row object
  const userRows = {}
  users.forEach((user, index) => {
    userRows[index] = [
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
          {seats && seats.usedSeats === seats.totalSeats &&
          <p className="small --align-right">
            You have filled all of your <b>{seats.totalSeats}</b> seats.<br />
            <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]}>
              <Link to={PATH_BILLING}>Add some seats</Link> if you’d like to add more users.
            </OrgPermission>
            <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.ADMIN]}>
              Contact your organization owner to add more seats.
            </OrgPermission>
          </p>
          }
          {seats && seats.usedSeats < seats.totalSeats &&
          <button
            className="btn"
            disabled={isCreating}
            onClick={() => { setCreateMode(true) }}>
              Add User
          </button>
          }
        </header>
        {isCreating &&
        <>
          {seats && seats.usedSeats < seats.totalSeats &&
          <AdminUsersCreateForm
            cancelHandler={() => {setCreateMode(false) }}
            disabled={seats.usedSeats === seats.totalSeats}
            errors={errors}
            submitHandler={addUserHandler}
          />
          }
        </>
        }
        {!isCreating &&
          <>
          <form className="admin-users__search" onSubmit={e => e.preventDefault()}>
            <FormField
              label="Search users"
              id="search-users-field"
              name="search-users-field"
              type="search"
              onChange={(e) => { searchUsersHandler(e.target.value) }}
              placeholder="Jane Doe..."
              ref={searchFieldRef}
            />
          </form>
          <Table
            headings={userHeadings}
            rows={userRows}
            sortCallback={sortUsersHandler}
            sortedBy={sortBy}
            sortMethod={sortMethod} />
          <PaginatorContainer totalPages={totalPages} />
          </>
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
  isSearching: PropTypes.string,
  reinviteUserHandler: PropTypes.func,
  removeUserHandler: PropTypes.func,
  searchUsersHandler: PropTypes.func.isRequired,
  setCreateMode: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortMethod: PropTypes.string.isRequired,
  sortUsersHandler: PropTypes.func,
  seats: PropTypes.object,
  users: PropTypes.array.isRequired,
  totalPages: PropTypes.number
}

export default AdminUsersComponent
