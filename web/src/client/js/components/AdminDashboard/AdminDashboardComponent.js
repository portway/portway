import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { NavLink, Redirect } from 'react-router-dom'

import { PATH_ADMIN, PRODUCT_NAME } from 'Shared/constants'
import AdminInfoContainer from './AdminInfo/AdminInfoContainer'
import BillingContainer from 'Components/Billing/BillingContainer'

const ADMIN_PATHS = {
  INFO: 'info',
  USERS: 'users',
  BILLING: 'billing'
}

const AdminDashboardComponent = ({ section }) => {
  function renderAdminPanel() {
    switch (section) {
      case ADMIN_PATHS.INFO: {
        return <AdminInfoContainer />
      }
      case ADMIN_PATHS.BILLING: {
        return <BillingContainer />
      }
      default:
        return <Redirect to={`${PATH_ADMIN}/${ADMIN_PATHS.INFO}`} />
    }
  }

  return (
    <>
      <Helmet>
        <title>Dashboard – {PRODUCT_NAME}</title>
      </Helmet>
      <main>
        <div className="panel">
          <div className="panel__container">
            <nav className="panel__navigation">
              <ul className="list--blank">
                <li><NavLink to={`${PATH_ADMIN}/${ADMIN_PATHS.INFO}`}>Info</NavLink></li>
                <li><NavLink to={`${PATH_ADMIN}/${ADMIN_PATHS.USERS}`}>Users</NavLink></li>
                <li><NavLink to={`${PATH_ADMIN}/${ADMIN_PATHS.BILLING}`}>Billing</NavLink></li>
              </ul>
            </nav>
            <div className="panel__content">
              {renderAdminPanel()}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

AdminDashboardComponent.propTypes = {
  section: PropTypes.string
}

export default AdminDashboardComponent
