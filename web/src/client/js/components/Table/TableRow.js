import React from 'react'
import PropTypes from 'prop-types'

const TableRow = ({ cells }) => {
  function renderCells() {
    return cells.map((cell, index) => {
      return <div className="table__cell" key={index}>{cell}</div>
    })
  }
  return (
    <li className="table__row">{renderCells()}</li>
  )
}

TableRow.propTypes = {
  cells: PropTypes.array
}

export default TableRow
