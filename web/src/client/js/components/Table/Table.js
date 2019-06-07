import React from 'react'
import PropTypes from 'prop-types'

import { QUERY_PARAMS } from 'Shared/constants'
import TableHeading from './TableHeading'
import TableRow from './TableRow'

import './_TableStyles.scss'

const Table = ({ headings, rows, sortedBy, sortMethod, sortCallback }) => {
  function renderHeadings() {
    return Object.keys(headings).map((hId) => {
      return (
        <TableHeading
          key={hId}
          id={hId}
          sortable={headings[hId].sortable}
          sorted={sortedBy === hId}
          sortMethod={sortMethod}
          sortHandler={sortCallback}>
          {headings[hId].label}
        </TableHeading>
      )
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
        <li className="table__row table__heading">
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
  rows: PropTypes.object.isRequired,
  sortedBy: PropTypes.string,
  sortMethod: PropTypes.oneOf([QUERY_PARAMS.ASCENDING, QUERY_PARAMS.DESCENDING]),
  sortCallback: PropTypes.func
}

Table.defaultProps = {
  sortable: false
}

export default Table
