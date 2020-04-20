import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

const MenuItem = ({ className, children, padded, ...props }) => {
  const menuItemClasses = cx({
    'menu__item': true,
    'menu__item--with-padding': padded,
    [className]: className
  })
  return (
    <li className={menuItemClasses} role="menuitem" {...props}>
      {children}
    </li>
  )
}

MenuItem.displayName = 'MenuItem'

MenuItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  padded: PropTypes.bool,
}

export default MenuItem
