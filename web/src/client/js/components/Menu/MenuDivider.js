import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

const MenuDivider = ({ className, children, ...props }) => {
  const menuTitleClasses = cx({
    'menu__divider': true,
    [className]: className
  })
  return (
    <li className={menuTitleClasses} {...props}>
      {children}
    </li>
  )
}

MenuDivider.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

export default MenuDivider
