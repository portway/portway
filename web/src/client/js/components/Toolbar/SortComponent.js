import React from 'react'

import DropdownComponent from 'Components/Dropdown/DropdownComponent'

function SortComponent() {
  const sortButton = {
    className: 'btn--blank',
    icon: 'icon-sort-by',
    label: 'Sort by...'
  }
  return (
    <DropdownComponent button={sortButton}>
      <li className="menu__item">
        <button className="btn btn--blank">Title</button>
      </li>
    </DropdownComponent>
  )
}

export default SortComponent
