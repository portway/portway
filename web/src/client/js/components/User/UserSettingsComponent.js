import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { ORGANIZATION_ROLE_IDS, PATH_SETTINGS, PRODUCT_NAME } from 'Shared/constants'
import OrgPermission from 'Components/Permission/OrgPermission'

import { Panel, PanelNavigation, PanelContent } from 'Components/Panel'
import UserProfileContainer from './UserProfile/UserProfileContainer'
import UserSecurityContainer from './UserSecurity/UserSecurityContainer'
import UserOrganizationContainer from './UserOrganization/UserOrganizationContainer'
import UserBillingContainer from './UserBilling/UserBillingContainer'

const UserSettingsComponent = ({ section }) => {
  const USER_PATHS = {
    PROFILE: 'profile',
    SECURITY: 'security',
    ORGANIZATION: 'organization',
    BILLING: 'billing'
  }

  const PANEL_PATHS = {
    [USER_PATHS.PROFILE]: <UserProfileContainer />,
    [USER_PATHS.SECURITY]: <UserSecurityContainer />,
    [USER_PATHS.ORGANIZATION]: <UserOrganizationContainer />,
    [USER_PATHS.BILLING]: <UserBillingContainer />,
    default: <Redirect to={`${PATH_SETTINGS}/${USER_PATHS.PROFILE}`} />
  }

  return (
    <>
      <Helmet>
        <title>Settings: {PRODUCT_NAME}</title>
      </Helmet>
      <main>
        <Panel>
          <PanelNavigation>
            <NavLink to={`${PATH_SETTINGS}/${USER_PATHS.PROFILE}`}>My Profile</NavLink>
            <NavLink to={`${PATH_SETTINGS}/${USER_PATHS.SECURITY}`}>Security</NavLink>
            <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]}>
              <NavLink to={`${PATH_SETTINGS}/${USER_PATHS.ORGANIZATION}`}>Organization</NavLink>
            </OrgPermission>
            <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]}>
              <NavLink to={`${PATH_SETTINGS}/${USER_PATHS.BILLING}`}>Billing</NavLink>
            </OrgPermission>
          </PanelNavigation>
          <PanelContent contentKey={section} contentMap={PANEL_PATHS} />
        </Panel>
      </main>
    </>
  )
}

UserSettingsComponent.propTypes = {
  section: PropTypes.string
}

export default UserSettingsComponent
