import React, { lazy } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Link, NavLink, Redirect } from 'react-router-dom'

import {
  ORGANIZATION_ROLE_IDS,
  PATH_ADMIN,
  PATH_PROJECTS,
  PRODUCT_NAME,
  MULTI_USER_PLAN_TYPES
} from 'Shared/constants'
import { ArrowIcon, TeamsIcon, OrganizationIcon, BillingIcon } from 'Components/Icons'
import { Panel, PanelNavigation, PanelContent } from 'Components/Panel'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import OrgPermission from 'Components/Permission/OrgPermission'
import AdminUsersContainer from './AdminUsers/AdminUsersContainer'
import AdminUserViewContainer from './AdminUserView/AdminUserViewContainer'

// Lazy loading these because most users won't see these sections
const AdminBillingContainer = lazy(() => import(/* webpackChunkName: 'AdminBillingContainer' */ './AdminBilling/AdminBillingContainer'))
const AdminOrganizationContainer = lazy(() => import(/* webpackChunkName: 'AdminOrganizationContainer' */ './AdminOrganization/AdminOrganizationContainer'))

const ADMIN_PATHS = {
  BILLING: 'billing',
  ORGANIZATION: 'organization',
  USER: 'user',
  USERS: 'users',
}

const AdminDashboardComponent = ({ organization, section }) => {
  if (!organization) return null

  const PANEL_PATHS = {
    [ADMIN_PATHS.USER]: <AdminUserViewContainer />,
    [ADMIN_PATHS.USERS]: <AdminUsersContainer />,
    [ADMIN_PATHS.BILLING]: <AdminBillingContainer />,
    [ADMIN_PATHS.ORGANIZATION]: <AdminOrganizationContainer />,
    default: MULTI_USER_PLAN_TYPES.includes(organization.plan) ? (
      <Redirect to={`${PATH_ADMIN}/${ADMIN_PATHS.USERS}`} />
    ) : (
      <Redirect to={`${PATH_ADMIN}/${ADMIN_PATHS.ORGANIZATION}`} />
    )
  }

  function isSubSection(match, location) {
    // Return true if we're on the right page
    if (match && match.isExact) return true
    // Return true if we want to also be active on a slightly different URL
    if (location.pathname.split('/')[2] === ADMIN_PATHS.USER) return true
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
            {section === 'user' &&
            <Link to={`${PATH_ADMIN}/users`} className="link--back">
              <ArrowIcon direction="left" /><span className="label">Back to Users</span>
            </Link>
            }
            <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES}>
              <NavLink to={`${PATH_ADMIN}/${ADMIN_PATHS.USERS}`} aria-label="Users" isActive={isSubSection}>
                <TeamsIcon width="22" height="22" /> <span className="label">Users</span>
              </NavLink>
            </OrgPlanPermission>
            <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]}>
              <NavLink to={`${PATH_ADMIN}/${ADMIN_PATHS.ORGANIZATION}`} aria-label="Organization">
                <OrganizationIcon width="22" height="22" /> <span className="label">Organization</span>
              </NavLink>
              <NavLink to={`${PATH_ADMIN}/${ADMIN_PATHS.BILLING}`} aria-label="Billing">
                <BillingIcon width="22" height="22" /> <span className="label">Billing</span>
              </NavLink>
            </OrgPermission>
          </PanelNavigation>
          <PanelContent contentKey={section} contentMap={PANEL_PATHS} />
        </Panel>
      </main>
    </OrgPermission>
  )
}

AdminDashboardComponent.propTypes = {
  organization: PropTypes.object,
  section: PropTypes.string,
}

export default AdminDashboardComponent
