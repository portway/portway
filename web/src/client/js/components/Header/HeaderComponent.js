import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link } from 'react-router-dom'
import cx from 'classnames'

import {
  LOCKED_ACCOUNT_STATUSES,
  ORGANIZATION_ROLE_IDS,
  PATH_ADMIN,
  PATH_BILLING,
  PATH_PROJECTS,
  PATH_SETTINGS,
  ORG_SUBSCRIPTION_STATUS,
} from 'Shared/constants'

import UserMenuContainer from 'Components/UserMenu/UserMenuContainer'
import OrgPermission from 'Components/Permission/OrgPermission'
import NavigatorContainer from 'Components/Navigator/NavigatorContainer'

import './_Header.scss'

const renderBrandLogo = (logo) => {
  return {
    backgroundImage: `url('${logo}')`
  }
}

const grayPillStatuses = [ORG_SUBSCRIPTION_STATUS.TRIALING, ORG_SUBSCRIPTION_STATUS.PENDING_CANCEL, null]

const HeaderComponent = ({ brand, isFullScreen, section, subscriptionStatus }) => {
  const upgradePillClasses = cx({
    'pill': true,
    'pill--red': LOCKED_ACCOUNT_STATUSES.includes(subscriptionStatus),
    'pill--gray': grayPillStatuses.includes(subscriptionStatus)
  })
  if (!isFullScreen) {
    return (
      <header className="masthead" role="banner">
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar__brand">
            <Link to={PATH_PROJECTS} aria-label="Your projects">
              <span className="navbar__logo" style={renderBrandLogo(brand.logo)} />
            </Link>
          </div>
          <div className="navbar__content">
            {`/${section}` === PATH_SETTINGS && (<>My Settings</>)}
            {`/${section}` === PATH_ADMIN && (<>Administer Organization</>)}
            {`/${section}` !== PATH_ADMIN && `/${section}` !== PATH_SETTINGS && <NavigatorContainer />}
          </div>
          <div className="navbar__misc">
            {(subscriptionStatus === ORG_SUBSCRIPTION_STATUS.TRIALING || subscriptionStatus === null) &&
            <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<b className={upgradePillClasses}>TRIAL PERIOD</b>}>
              <NavLink to={PATH_BILLING} className={upgradePillClasses}>Upgrade your account</NavLink>
            </OrgPermission>
            }
            {subscriptionStatus === ORG_SUBSCRIPTION_STATUS.PENDING_CANCEL &&
            <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<b className={upgradePillClasses}>ACCOUNT CANCELED</b>}>
              <NavLink to={PATH_BILLING} className={upgradePillClasses}>ACCOUNT CANCELED</NavLink>
            </OrgPermission>
            }
            {LOCKED_ACCOUNT_STATUSES.includes(subscriptionStatus) &&
            <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]}>
              <NavLink to={PATH_BILLING} className={upgradePillClasses}>Your account needs attention</NavLink>
            </OrgPermission>
            }
          </div>
          <div className="navbar__user">
            <UserMenuContainer />
          </div>
        </nav>
      </header>
    )
  } else {
    return null
  }
}

HeaderComponent.propTypes = {
  brand: PropTypes.object,
  isFullScreen: PropTypes.bool.isRequired,
  section: PropTypes.string.isRequired,
  subscriptionStatus: PropTypes.string || null,
}

export default HeaderComponent
