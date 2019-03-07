import React from 'react'
import PropTypes from 'prop-types'
import { Link, NavLink } from 'react-router-dom'

import Constants from 'Shared/constants'
import Navigator from 'Components/Navigator/NavigatorContainer'
import GlobalSearchContainer from 'Components/GlobalSearch/GlobalSearchContainer'

import './Header.scss'

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

const Header = ({ path, params }) => {
  const section = path.split('/')[1]
  return (
    <header className="masthead" role="banner">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link to={Constants.PATH_DASHBOARD}>
            <span className="navbar-logo" style={renderBrandLogo(brand.logo)} />
          </Link>
        </div>
        <div className="navbar-content">
          {`/${section}` === Constants.PATH_DASHBOARD && (
            <h1 className={`navbar-brand-name${brand.default ? ' default' : ''}`}>
              <NavLink to={Constants.PATH_DASHBOARD}>{Constants.PRODUCT_NAME}</NavLink>
            </h1>
          )}
          {`/${section}` !== Constants.PATH_DASHBOARD &&
            `/${section}` !== Constants.PATH_SETTINGS && (
            <Navigator section={section} params={params} />
          )}
          <GlobalSearchContainer params={params} />
        </div>
        <div className="navbar-user">
          <NavLink to={Constants.PATH_SETTINGS} className="navbar-settings-link">
            <img src="/images/icon/user-avatar.svg" width="40" height="40" alt="User profile" />
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

Header.propTypes = {
  path: PropTypes.string,
  params: PropTypes.object
}

export default Header
