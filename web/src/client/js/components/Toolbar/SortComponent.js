import React from 'react'

import { SortIcon } from 'Components/Icons'
import { DropdownComponent, DropdownItem } from 'Components/Dropdown/Dropdown'

function SortComponent() {
  const sortButton = {
    className: 'btn--blank',
    icon: <SortIcon width="18" height="18" />
  }
  return (
    <DropdownComponent button={sortButton} align="right">
      <DropdownItem label="Title" type="button" />
    </DropdownComponent>
  )
}

export default SortComponent
