import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { NavLink, Redirect } from 'react-router-dom'

import { ORGANIZATION_ROLE_IDS, PATH_ADMIN, PATH_PROJECTS, PRODUCT_NAME } from 'Shared/constants'
import { Panel, PanelNavigation, PanelContent } from 'Components/Panel'
import OrgPermission from 'Components/Permission/OrgPermission'
import AdminUsersContainer from './AdminUsers/AdminUsersContainer'
import AdminUserViewContainer from './AdminUserView/AdminUserViewContainer'

const ADMIN_PATHS = {
  USER: 'user',
  USERS: 'users',
}

const PANEL_PATHS = {
  [ADMIN_PATHS.USER]: <AdminUserViewContainer />,
  [ADMIN_PATHS.USERS]: <AdminUsersContainer />,
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
        <title>Dashboard – {PRODUCT_NAME}</title>
      </Helmet>
      <main>
        <Panel>
          <PanelNavigation>
            <NavLink
              to={`${PATH_ADMIN}/${ADMIN_PATHS.USERS}`}
              isActive={(match, location) => { return isSubSection(ADMIN_PATHS.USER, match) }}>Users</NavLink>
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
