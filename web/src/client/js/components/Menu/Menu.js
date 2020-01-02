import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './_Menu.scss'

export const Menu = ({ className, children, ...props }) => {
  const menuClasses = cx({
    'menu': true,
    [className]: className
  })
  return (
    <ul className={menuClasses} role="menu" tabIndex="-1" {...props}>
      {children}
    </ul>
  )
}

Menu.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

export const MenuItem = ({ className, children, ...props }) => {
  const menuItemClasses = cx({
    'menu__item': true,
    [className]: className
  })
  return (
    <li className={menuItemClasses} role="menuitem" {...props}>
      {children}
    </li>
  )
}

MenuItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

export const MenuHeader = ({ className, children, ...props }) => {
  const menuTitleClasses = cx({
    'menu__header': true,
    [className]: className
  })
  return (
    <header className={menuTitleClasses} {...props}>
      {children}
    </header>
  )
}

MenuHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}
