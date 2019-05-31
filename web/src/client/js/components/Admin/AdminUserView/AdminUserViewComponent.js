import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { RemoveIcon } from 'Components/Icons'
import { ORGANIZATION_ROLE_NAMES, PATH_ADMIN } from 'Shared/constants'
import OrgRolesDropdown from 'Components/RolesDropdowns/OrgRolesDropdown'

import './_AdminUserView.scss'

const AdminUserViewComponent = ({ roleChangeHandler, user }) => {
  return (
    <div className="admin-user">
      <header className="header header--with-button">
        <h2>{user.name}</h2>
        <Link to={`${PATH_ADMIN}/users`} className="btn btn--blank btn--with-circular-icon admin-user__back-btn">
          <span className="label">Back to Users</span>
          <RemoveIcon />
        </Link>
      </header>
      <section>
        <h2>General Information</h2>
        <div className="form">
          <div className="form-field">
            <div className="field">
              <span className="field__label">Email</span>
              <div className="field__control">
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </div>
            </div>
          </div>
          <div className="form-field">
            <div className="field">
              <span className="field__label">Date added</span>
              <div className="field__control">
                {moment(user.createdAt).format()}
              </div>
            </div>
          </div>
          <div className="form-field">
            <div className="field">
              <span className="field__label">User Role</span>
              <div className="field__control">
                <OrgRolesDropdown defaultValue={user.orgRoleId} onChange={roleChangeHandler} />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

AdminUserViewComponent.propTypes = {
  roleChangeHandler: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default AdminUserViewComponent
