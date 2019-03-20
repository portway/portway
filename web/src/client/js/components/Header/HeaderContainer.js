import React from 'react'
import { Link, NavLink } from 'react-router-dom'

import Constants from 'Shared/constants'
import Header from './Header'

const brand = {
  logo: Constants.PRODUCT_LOGO,
  name: Constants.PRODUCT_NAME,
  default: true // if this is our branding
}

const renderBrandLogo = (logo) => {
  return {
    background: `url('${logo}') no-repeat 50% 50%`
  }
}

function HeaderContainer() {
  return (
    <header className="masthead" role="banner">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link to={Constants.PATH_DASHBOARD}>
            <span className="navbar-logo" style={renderBrandLogo(brand.logo)} />
          </Link>
        </div>
        <Header brand={brand} />
        <div className="navbar-user">
          <NavLink to={Constants.PATH_SETTINGS} className="navbar-settings-link">
            <img src="/images/icon/user-avatar.svg" width="40" height="40" alt="User profile" />
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

export default HeaderContainer
