import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { QUERY_PARAMS } from 'Shared/constants'
import TableHeading from './TableHeading'
import TableRow from './TableRow'

import './_TableStyles.scss'

const Table = ({ className, headings, rows, sortedBy, sortMethod, sortCallback }) => {
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

  const tableClasses = cx({
    'table': true,
    [`${className}`]: className
  })

  return (
    <section className={tableClasses}>
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
  className: PropTypes.string,
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
