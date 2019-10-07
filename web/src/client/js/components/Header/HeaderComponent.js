import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link } from 'react-router-dom'

import {
  ORGANIZATION_ROLE_IDS,
  PATH_ADMIN,
  PATH_BILLING,
  PATH_PROJECTS,
  PATH_SETTINGS
} from 'Shared/constants'

import Navigator from 'Components/Navigator/NavigatorContainer'
import UserMenuContainer from 'Components/UserMenu/UserMenuContainer'
import OrgPermission from 'Components/Permission/OrgPermission'

import './_Header.scss'

const renderBrandLogo = (logo) => {
  return {
    backgroundImage: `url('${logo}')`
  }
}

const HeaderComponent = ({ brand, isFullScreen, section }) => {
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
            {`/${section}` !== PATH_ADMIN && `/${section}` !== PATH_SETTINGS && <Navigator />}
          </div>
          <div className="navbar__misc">
            <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER]}>
              <NavLink to={PATH_BILLING} className="pill pill--orange">Upgrade your account</NavLink>
            </OrgPermission>
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
}

export default HeaderComponent
