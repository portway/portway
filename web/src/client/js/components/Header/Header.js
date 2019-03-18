import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, withRouter } from 'react-router-dom'

import Constants from 'Shared/constants'
import Navigator from 'Components/Navigator/NavigatorContainer'
import GlobalSearchContainer from 'Components/GlobalSearch/GlobalSearchContainer'

import './Header.scss'

const Header = ({ brand, match }) => {
  const section = match.path.split('/')[1]
  return (
    <div className="navbar-content">
      {`/${section}` === Constants.PATH_DASHBOARD && (
        <h1 className={`navbar-brand-name${brand.default ? ' default' : ''}`}>
          <NavLink to={Constants.PATH_DASHBOARD}>{Constants.PRODUCT_NAME}</NavLink>
        </h1>
      )}
      {`/${section}` !== Constants.PATH_DASHBOARD &&
        `/${section}` !== Constants.PATH_SETTINGS && <Navigator />}
      <GlobalSearchContainer />
    </div>
  )
}

Header.propTypes = {
  brand: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object
}

export default withRouter(Header)
