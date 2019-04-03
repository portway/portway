import React from 'react'

import DropdownComponent from 'Components/Dropdown/DropdownComponent'

function FilterComponent() {
  const filterButton = {
    className: 'btn--blank',
    icon: 'icon-filter'
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
