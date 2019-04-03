import React from 'react'

import DropdownComponent from 'Components/Dropdown/DropdownComponent'

function SortComponent() {
  const sortButton = {
    className: 'btn--blank',
    icon: 'icon-sort-by'
  }
  return (
    <DropdownComponent button={sortButton} align="right">
      <li className="menu__item">
        <button className="btn btn--blank">Title</button>
      </li>
    </DropdownComponent>
  )
}

export default SortComponent
