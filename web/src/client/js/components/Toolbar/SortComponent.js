import React from 'react'

import { SortIcon } from 'Components/Icons'
import DropdownComponent from 'Components/Dropdown/DropdownComponent'

function SortComponent() {
  const sortButton = {
    className: 'btn--blank',
    icon: <SortIcon width="18" height="18" />
  }
  return (
    <DropdownComponent button={sortButton} align="right">
      <li>
        <button>Title</button>
      </li>
    </DropdownComponent>
  )
}

export default SortComponent
