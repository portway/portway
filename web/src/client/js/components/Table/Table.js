import React from 'react'
import PropTypes from 'prop-types'

import TableHeading from './TableHeading'
import TableRow from './TableRow'

const Table = ({ headings, rows }) => {
  function renderHeadings() {
    return Object.keys(headings).map((hId) => {
      return <TableHeading key={hId} sortable={headings[hId].sortable}>{headings[hId].label}</TableHeading>
    })
  }

  function renderRows() {
    return Object.keys(rows).map((rId) => {
      return <TableRow key={rId} cells={rows[rId]} />
    })
  }

  return (
    <section className="table">
      <ol className="table__list">
        <li className="table__heading">
          {renderHeadings()}
        </li>
        {renderRows()}
      </ol>
    </section>
  )
}

// @todo Shape this up
Table.propTypes = {
  headings: PropTypes.object.isRequired,
  rows: PropTypes.object.isRequired
}

Table.defaultProps = {
  sortable: false
}

export default Table
