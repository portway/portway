import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import './NavigatorItemList.scss'

const NavigatorItemList = ({ items }) => {
  const itemKeys = Object.keys(items)
  const itemList = itemKeys.map((item) => {
    return (
      <li key={item} className="navigator-item-list__list-item">
        <NavLink to={`/project/${item}`}>{items[item].name}</NavLink>
      </li>
    )
  })
  return <ol className="navigator-item-list">{itemList}</ol>
}

NavigatorItemList.propTypes = {
  items: PropTypes.object
}

export default NavigatorItemList
