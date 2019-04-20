import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const DropdownItem = ({ children, label, onClick, href, type }) => {
  let elementType
  switch (type) {
    case 'button':
      elementType = <button type="button" onClick={onClick}>{label}{children}</button>
      break
    case 'link':
      elementType = <Link to={href} onClick={onClick}>{label}{children}</Link>
      break
    default:
      break
  }
  return (
    <li className="menu__item">
      {elementType}
    </li>
  )
}

DropdownItem.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'link'])
}

DropdownItem.defaultProps = {
  type: 'button'
}

export default DropdownItem
