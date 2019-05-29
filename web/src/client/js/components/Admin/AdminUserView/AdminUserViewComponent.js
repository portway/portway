import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { ORGANIZATION_ROLE_NAMES, PATH_ADMIN } from 'Shared/constants'

const AdminUserViewComponent = ({ user }) => {
  return (
    <div>
      <header className="header">
        <Link to={`${PATH_ADMIN}/users`} className="link--back">Back to Users</Link>
        <h2>{user.name}</h2>
        <h3>{ORGANIZATION_ROLE_NAMES[user.orgRoleId]}</h3>
        <p>Joined your organization {moment(user.createdAt).format('MMMM Do, Y')}</p>
      </header>
      <section>
        <h2>Contact Information</h2>
        <p>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
      </section>
    </div>
  )
}

AdminUserViewComponent.propTypes = {
  user: PropTypes.object.isRequired
}

export default AdminUserViewComponent
