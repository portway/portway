import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

const NavigatorItemList = ({ basePath, onChange, options }) => {
  const listItems = options.map((item) => {
    return (
      <li key={item.value}>
        <NavLink to={`${basePath}/${item.value}`} className="menu__item" onClick={onChange}>
          {item.label}
        </NavLink>
      </li>
    )
  })
  return <ol className="menu__list">{listItems}</ol>
}

NavigatorItemList.propTypes = {
  basePath: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    })
  ).isRequired
}

export default NavigatorItemList
