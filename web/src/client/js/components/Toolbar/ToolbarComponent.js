import React from 'react'
import PropTypes from 'prop-types'

import FilterComponent from './FilterComponent'
import SortComponent from './SortComponent'

import './Toolbar.scss'

const ToolbarComponent = ({ action, filter, sort }) => {
  return (
    <header className="toolbar">
      <div className="toolbar__start">
        <button className="btn btn--blank btn--with-circular-icon" onClick={action.callback}>
          <span className={`icon ${action.icon}`} />
          {action.label}
        </button>
      </div>
      <div className="toolbar__end">
        {filter && <FilterComponent />}
        {sort && <SortComponent />}
      </div>
    </header>
  )
}

ToolbarComponent.propTypes = {
  action: PropTypes.object,
  filter: PropTypes.bool,
  sort: PropTypes.bool
}

export default ToolbarComponent
