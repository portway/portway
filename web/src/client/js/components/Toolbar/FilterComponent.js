import React from 'react'

import { FilterIcon } from 'Components/Icons'
import { DropdownComponent, DropdownItem } from 'Components/Dropdown/Dropdown'

function FilterComponent() {
  const filterButton = {
    className: 'btn--blank',
    icon: <FilterIcon />
  }
  return (
    <DropdownComponent button={filterButton} align="right">
      <DropdownItem>
        <div className="form-item">
          <label><input type="radio" name="some-filter" /> Some filter</label>
        </div>
      </DropdownItem>
    </DropdownComponent>
  )
}

export default FilterComponent
