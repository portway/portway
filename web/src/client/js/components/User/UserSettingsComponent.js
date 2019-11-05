import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { PATH_SETTINGS, PRODUCT_NAME } from 'Shared/constants'

import { LockIcon, UserIcon } from 'Components/Icons'
import { Panel, PanelNavigation, PanelContent } from 'Components/Panel'
import UserProfileContainer from './UserProfile/UserProfileContainer'
import UserSecurityContainer from './UserSecurity/UserSecurityContainer'

const UserSettingsComponent = ({ section }) => {
  const USER_PATHS = {
    PROFILE: 'profile',
    SECURITY: 'security',
  }

  const PANEL_PATHS = {
    [USER_PATHS.PROFILE]: <UserProfileContainer />,
    [USER_PATHS.SECURITY]: <UserSecurityContainer />,
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
            <NavLink to={`${PATH_SETTINGS}/${USER_PATHS.PROFILE}`} aria-label="My Profile">
              <UserIcon width="22" height="22" /> <span className="label">My Profile</span>
            </NavLink>
            <NavLink to={`${PATH_SETTINGS}/${USER_PATHS.SECURITY}`} aria-label="Security">
              <LockIcon width="22" height="22" /> <span className="label">Security</span>
            </NavLink>
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
