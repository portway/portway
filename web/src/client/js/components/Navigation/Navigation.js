import React from 'react'
import { NavLink } from 'react-router-dom'
import Constants from 'Shared/constants'

import './Navigation.scss'

const navItems = [
  {
    path: Constants.PATH_PROJECTS,
    ariaLabel: 'Your projects',
    label: 'Projects'
  },
  {
    path: Constants.PATH_DOCUMENTS,
    ariaLabel: 'Your documents',
    label: 'Documents'
  }
]

const renderNavItems = () => {
  const navLinks = []
  navItems.forEach((item, index) => {
    navLinks.push(
      <NavLink key={index} to={item.path} className="navbar-item" aria-label={item.ariaLabel}>
        {item.label}
      </NavLink>
    )
  })
  return navLinks
}

const Navigation = () => {
  return (
    <header className="masthead" role="banner">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <h1 className="navbar-item">
            <NavLink to={Constants.PATH_DASHBOARD}>{Constants.PRODUCT_NAME}</NavLink>
          </h1>
        </div>
        <div className="navbar-start">
          <ul className="navbar-menu">{renderNavItems()}</ul>
        </div>
        <div className="navbar-end">
          <NavLink to={Constants.PATH_SETTINGS} className="navbar-item">
            Account
            <figure className="image is-24x24">
              <img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" />
            </figure>
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Navigation
