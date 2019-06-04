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
import GlobalSearchContainer from 'Components/GlobalSearch/GlobalSearchContainer'
import UserMenuContainer from 'Components/UserMenu/UserMenuContainer'
import OrgPermission from 'Components/Permission/OrgPermission'

import './_Header.scss'

const renderBrandLogo = (logo) => {
  return {
    background: `url('${logo}') no-repeat 50% 50%`
  }
}

const HeaderComponent = ({ brand, section }) => {
  return (
    <header className="masthead" role="banner">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar__brand">
          <Link to={PATH_PROJECTS}>
            <span className="navbar__logo" style={renderBrandLogo(brand.logo)} />
          </Link>
        </div>
        <div className="navbar__content">
          {`/${section}` === PATH_SETTINGS && (<>My Settings</>)}
          {`/${section}` === PATH_ADMIN && (<>Administer Organization</>)}
          {`/${section}` !== PATH_ADMIN && `/${section}` !== PATH_SETTINGS && <Navigator />}
        </div>
        <div className="navbar__misc">
          <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}>
            <NavLink to={PATH_BILLING} className="pill pill--orange">Upgrade your account</NavLink>
          </OrgPermission>
        </div>
        <GlobalSearchContainer />
        <div className="navbar__user">
          <UserMenuContainer />
        </div>
      </nav>
    </header>
  )
}

HeaderComponent.propTypes = {
  brand: PropTypes.object,
  section: PropTypes.string.isRequired,
}

export default HeaderComponent
