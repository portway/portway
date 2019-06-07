import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { QUERY_PARAMS } from 'Shared/constants'
import { CaretIcon } from 'Components/Icons'

const TableHeading = ({ children, id, sortable, sorted, sortMethod, sortHandler }) => {
  const headingBtnClasses = cx({
    'btn btn--blank table__heading-btn': true,
    'table__heading-btn--sortable': sortable,
    'table__heading-btn--sorted': sorted,
    'table__heading-btn--ascending': sortMethod === QUERY_PARAMS.ASCENDING,
    'table__heading-btn--descending': sortMethod === QUERY_PARAMS.DESCENDING,
  })
  return (
    <div className="table__heading-cell">
      {sortable && sorted &&
      <>
        <button className={headingBtnClasses} onClick={() => sortHandler(id)}>{children}</button>
        <CaretIcon />
      </>
      }
      {sortable && !sorted &&
      <>
        <button className={headingBtnClasses} onClick={() => sortHandler(id)}>{children}</button>
      </>
      }
      {!sortable &&
      <>{children}</>
      }
    </div>
  )
}

TableHeading.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  sortable: PropTypes.bool,
  sorted: PropTypes.bool,
  sortMethod: PropTypes.oneOf([QUERY_PARAMS.ASCENDING, QUERY_PARAMS.DESCENDING]),
  sortHandler: PropTypes.func
}

export default TableHeading
