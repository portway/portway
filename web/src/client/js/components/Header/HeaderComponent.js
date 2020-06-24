import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link } from 'react-router-dom'
import cx from 'classnames'

import {
  MOBILE_MATCH_SIZE,
  LOCKED_ACCOUNT_STATUSES,
  ORGANIZATION_ROLE_IDS,
  PATH_ADMIN,
  PATH_BILLING,
  PATH_HELP,
  PATH_PROJECTS,
  PATH_SETTINGS,
  ORG_SUBSCRIPTION_STATUS,
  TRIALING_STATUSES
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

const grayPillStatuses = [
  ORG_SUBSCRIPTION_STATUS.TRIAL_ENDED,
  ORG_SUBSCRIPTION_STATUS.TRIALING,
  ORG_SUBSCRIPTION_STATUS.PENDING_CANCEL,
  null]

const HeaderComponent = ({ brand, isFullScreen, loading, section, subscriptionStatus }) => {
  const upgradePillClasses = cx({
    'pill': true,
    'pill--red': LOCKED_ACCOUNT_STATUSES.includes(subscriptionStatus),
    'pill--gray': grayPillStatuses.includes(subscriptionStatus)
  })

  function getHeaderTitle(section) {
    const sectionPath = `/${section}`
    switch (sectionPath) {
      case PATH_SETTINGS:
        return <>My settings</>
      case PATH_ADMIN:
        return <>Administer organization</>
      case PATH_HELP:
        return <>Help</>
      default:
        if (!loading) return <NavigatorContainer />
        return ''
    }
  }

  if (!isFullScreen) {
    return (
      <>
        <header className="masthead" role="banner">
          <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar__brand">
              <Link to={PATH_PROJECTS} aria-label="Your projects" name="projects">
                <span className="navbar__logo" style={renderBrandLogo(brand.logo)} />
              </Link>
            </div>
            <div className="navbar__content">
              {getHeaderTitle(section)}
            </div>
            <div className="navbar__misc">
              {!window.matchMedia(MOBILE_MATCH_SIZE).matches &&
                (subscriptionStatus === ORG_SUBSCRIPTION_STATUS.TRIALING || subscriptionStatus === null) &&
                <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<b className={upgradePillClasses}>TRIAL PERIOD</b>}>
                  <NavLink to={PATH_BILLING} className={upgradePillClasses}>Upgrade your account</NavLink>
                </OrgPermission>
              }
            </div>
            <div className="navbar__user">
              <UserMenuContainer />
            </div>
          </nav>
        </header>
        {window.matchMedia(MOBILE_MATCH_SIZE).matches &&
        <div className="subhead">
          {(TRIALING_STATUSES.includes(subscriptionStatus) || subscriptionStatus === ORG_SUBSCRIPTION_STATUS.TRIAL_ENDED) &&
          <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<b className={upgradePillClasses}>TRIAL PERIOD</b>}>
            <NavLink to={PATH_BILLING}>Upgrade your account</NavLink>
          </OrgPermission>
          }
          {subscriptionStatus === ORG_SUBSCRIPTION_STATUS.PENDING_CANCEL &&
          <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]} elseRender={<b>ACCOUNT CANCELED</b>}>
            <NavLink to={PATH_BILLING}>ACCOUNT CANCELED</NavLink>
          </OrgPermission>
          }
          {LOCKED_ACCOUNT_STATUSES.includes(subscriptionStatus) &&
          <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]}>
            <NavLink to={PATH_BILLING}>Your account needs attention</NavLink>
          </OrgPermission>
          }
        </div>
        }
      </>
    )
  } else {
    return null
  }
}

HeaderComponent.propTypes = {
  brand: PropTypes.object,
  isFullScreen: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  section: PropTypes.string.isRequired,
  subscriptionStatus: PropTypes.string || null,
}

export default HeaderComponent
