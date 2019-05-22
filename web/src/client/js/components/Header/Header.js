import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link, withRouter } from 'react-router-dom'

import Constants from 'Shared/constants'
import { AddIcon } from 'Components/Icons'
import Navigator from 'Components/Navigator/NavigatorContainer'
import GlobalSearchContainer from 'Components/GlobalSearch/GlobalSearchContainer'
import UserMenuContainer from 'Components/UserMenu/UserMenuContainer'
import OrgPermission from 'Components/Permission/OrgPermission'

const { ORGANIZATION_ROLE_IDS, ORGANIZATION_SETTINGS } = Constants

import './Header.scss'

const renderBrandLogo = (logo) => {
  return {
    background: `url('${logo}') no-repeat 50% 50%`
  }
}

const renderProjectsItems = () => {
  return (
    <OrgPermission
      acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}
      acceptedSettings={[ORGANIZATION_SETTINGS.ALLOW_USER_PROJECT_CREATION]}>
      <div className="navbar__content-items">
        <Link
          className="btn btn--blank btn--with-circular-icon"
          title="Create a new project"
          to={Constants.PATH_PROJECT_CREATE}>
          <AddIcon />
          <span className="label">New Project</span>
        </Link>
      </div>
    </OrgPermission>
  )
}

const Header = ({ brand, location }) => {
  const section = location.pathname.split('/')[1]
  return (
    <header className="masthead" role="banner">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar__brand">
          <Link to={Constants.PATH_PROJECTS}>
            <span className="navbar__logo" style={renderBrandLogo(brand.logo)} />
          </Link>
        </div>
        <div className="navbar__content">
          {`/${section}` === Constants.PATH_DASHBOARD && (
            <h1 className={`navbar-brand-name${brand.default ? ' default' : ''}`}>
              <NavLink to={Constants.PATH_DASHBOARD}>{Constants.PRODUCT_NAME}</NavLink>
            </h1>
          )}
          {`/${section}` !== Constants.PATH_DASHBOARD &&
            `/${section}` !== Constants.PATH_SETTINGS && <Navigator />}
          {
            `/${section}` === Constants.PATH_PROJECT &&
            renderProjectsItems()
          }
          <GlobalSearchContainer />
        </div>
        <div className="navbar__user">
          <UserMenuContainer />
        </div>
      </nav>
    </header>
  )
}

Header.propTypes = {
  brand: PropTypes.object,
  location: PropTypes.object.isRequired
}

export default withRouter(Header)
