import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { NavLink, Redirect } from 'react-router-dom'

import { ORGANIZATION_ROLE_IDS, PATH_ADMIN, PATH_PROJECTS, PRODUCT_NAME } from 'Shared/constants'
import { Panel, PanelNavigation, PanelContent } from 'Components/Panel'
import OrgPermission from 'Components/Permission/OrgPermission'

const ADMIN_PATHS = {
  USERS: 'users',
}

const PANEL_PATHS = {
  default: <Redirect to={`${PATH_ADMIN}/${ADMIN_PATHS.USERS}`} />
}

const AdminDashboardComponent = ({ section }) => {
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
            <NavLink to={`${PATH_ADMIN}/${ADMIN_PATHS.USERS}`}>Users</NavLink>
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
