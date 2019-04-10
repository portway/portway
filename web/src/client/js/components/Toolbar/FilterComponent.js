import React from 'react'

import { FilterIcon } from 'Components/Icons'
import DropdownComponent from 'Components/Dropdown/DropdownComponent'

function FilterComponent() {
  const filterButton = {
    className: 'btn--blank',
    icon: <FilterIcon width="18" height="18" />
  }
  return (
    <DropdownComponent button={filterButton} align="right">
      <li className="menu__item">
        <div className="form-item">
          <label><input type="radio" name="some-filter" /> Some filter</label>
        </div>
      </li>
    </DropdownComponent>
  )
}

export default FilterComponent
