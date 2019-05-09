import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import cx from 'classnames'

const DropdownItem = ({ children, className, divider, label, onClick, href, type }) => {
  let elementType
  switch (type) {
    case 'button':
      elementType = <button className={className} type="button" onClick={onClick}>{label}{children}</button>
      break
    case 'link':
      elementType = <Link className={className} to={href} onClick={onClick}>{label}{children}</Link>
      break
    case 'submenu':
      elementType = <div className="menu__sub-item">{label}{children}</div>
      break
    default:
      elementType = <div className={className}>{children}</div>
      break
  }
  const menuItemClasses = cx({
    'menu__item': true,
    'menu__item--divider': divider
  })
  return (
    <li className={menuItemClasses}>
      {elementType}
    </li>
  )
}

DropdownItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  divider: PropTypes.bool,
  href: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'link', 'submenu', 'banner'])
}

DropdownItem.defaultProps = {
  type: 'button'
}

export default DropdownItem
