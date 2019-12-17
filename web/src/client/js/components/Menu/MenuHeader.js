import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

const MenuHeader = ({ className, children, ...props }) => {
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

export default MenuHeader
