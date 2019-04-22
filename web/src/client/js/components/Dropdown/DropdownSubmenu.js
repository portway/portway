import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

const DropdownSubmenu = ({ align, children }) => {
  const submenuClasses = cx({
    'menu': true,
    'menu__submenu': true,
    'menu__submenu--left': align === 'left',
    'menu__submenu--right': align === 'right',
  })
  return (
    <ul className={submenuClasses}>
      {children}
    </ul>
  )
}

DropdownSubmenu.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node
}

export default DropdownSubmenu
