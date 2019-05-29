import React from 'react'
import PropTypes from 'prop-types'

const TableHeading = ({ children, sortable }) => {
  return (
    <div className="table__heading-cell">
      {children}
    </div>
  )
}

TableHeading.propTypes = {
  children: PropTypes.node,
  sortable: PropTypes.bool
}

export default TableHeading
