import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { NavLink, Redirect } from 'react-router-dom'

import {
  ORGANIZATION_ROLE_IDS,
  PATH_ADMIN,
  PATH_PROJECTS,
  PRODUCT_NAME,
} from 'Shared/constants'
import { Panel, PanelNavigation, PanelContent } from 'Components/Panel'
import OrgPermission from 'Components/Permission/OrgPermission'
import AdminUsersContainer from './AdminUsers/AdminUsersContainer'
import AdminUserViewContainer from './AdminUserView/AdminUserViewContainer'
import AdminBillingContainer from './AdminBilling/AdminBillingContainer'
import AdminOrganizationContainer from './AdminOrganization/AdminOrganizationContainer'

const ADMIN_PATHS = {
  BILLING: 'billing',
  ORGANIZATION: 'organization',
  USER: 'user',
  USERS: 'users',
}

const PANEL_PATHS = {
  [ADMIN_PATHS.USER]: <AdminUserViewContainer />,
  [ADMIN_PATHS.USERS]: <AdminUsersContainer />,
  [ADMIN_PATHS.BILLING]: <AdminBillingContainer />,
  [ADMIN_PATHS.ORGANIZATION]: <AdminOrganizationContainer />,
  default: <Redirect to={`${PATH_ADMIN}/${ADMIN_PATHS.USERS}`} />
}

const AdminDashboardComponent = ({ section }) => {
  function isSubSection(path, match, location) {
    // Return true if we're on the right page
    if (match && match.isExact) return true
    // Return true if we want to also be active on a slightly different URL
    if (path === ADMIN_PATHS.USER) return true
  }

  return (
    <OrgPermission
      acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}
      elseRender={<Redirect to={PATH_PROJECTS} />}>
      <Helmet>
        <title>Admin – {PRODUCT_NAME}</title>
      </Helmet>
      <main>
        <Panel>
          <PanelNavigation>
            <NavLink to={`${PATH_ADMIN}/${ADMIN_PATHS.USERS}`}>Users</NavLink>
            <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]}>
              <NavLink to={`${PATH_ADMIN}/${ADMIN_PATHS.ORGANIZATION}`}>Organization</NavLink>
              <NavLink to={`${PATH_ADMIN}/${ADMIN_PATHS.BILLING}`}>Billing</NavLink>
            </OrgPermission>
          </PanelNavigation>
          <PanelContent contentKey={section} contentMap={PANEL_PATHS} />
        </Panel>
      </main>
    </OrgPermission>
  )
}

AdminDashboardComponent.propTypes = {
  section: PropTypes.string
}

export default AdminDashboardComponent
