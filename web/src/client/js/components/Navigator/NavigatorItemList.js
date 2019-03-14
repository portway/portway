import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import './NavigatorItemList.scss'

const NavigatorItemList = ({ items }) => {
  if (!items) return null
  const itemKeys = Object.keys(items)
  const itemList = itemKeys.map((item) => {
    return (
      <li key={item}>
        <NavLink to={`/project/${item}`} className="navigator-item-list__list-item">
          {items[item].name}
        </NavLink>
      </li>
    )
  })
  return <ol className="navigator-item-list">{itemList}</ol>
}

NavigatorItemList.propTypes = {
  items: PropTypes.object
}

export default NavigatorItemList
