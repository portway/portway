import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link, withRouter } from 'react-router-dom'

import {
  ORGANIZATION_ROLE_IDS,
  ORGANIZATION_SETTINGS,
  PATH_ADMIN, PATH_BILLING,
  PATH_PROJECTS,
  PATH_PROJECT,
  PATH_PROJECT_CREATE,
  PATH_SETTINGS } from 'Shared/constants'

import { AddIcon } from 'Components/Icons'
import Navigator from 'Components/Navigator/NavigatorContainer'
import GlobalSearchContainer from 'Components/GlobalSearch/GlobalSearchContainer'
import UserMenuContainer from 'Components/UserMenu/UserMenuContainer'
import OrgPermission from 'Components/Permission/OrgPermission'

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
          to={PATH_PROJECT_CREATE}>
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
          <Link to={PATH_PROJECTS}>
            <span className="navbar__logo" style={renderBrandLogo(brand.logo)} />
          </Link>
        </div>
        <div className="navbar__content">
          {`/${section}` === PATH_SETTINGS && (<>My Settings</>)}
          {`/${section}` === PATH_ADMIN && (<>Administer Organization</>)}
          {`/${section}` !== PATH_ADMIN && `/${section}` !== PATH_SETTINGS && <Navigator />}
          {`/${section}` === PATH_PROJECT && renderProjectsItems()}
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

Header.propTypes = {
  brand: PropTypes.object,
  location: PropTypes.object.isRequired
}

export default withRouter(Header)
