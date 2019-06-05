import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { CaretIcon } from 'Components/Icons'

const TableHeading = ({ children, id, sortable, sorted, sortMethod, sortHandler }) => {
  const headingBtnClasses = cx({
    'btn btn--blank table__heading-btn': true,
    'table__heading-btn--sortable': sortable,
    'table__heading-btn--sorted': sorted,
    'table__heading-btn--ascending': sortMethod === 'ASC',
    'table__heading-btn--descending': sortMethod === 'DESC',
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
  sortMethod: PropTypes.oneOf(['ASC', 'DESC']),
  sortHandler: PropTypes.func
}

export default TableHeading
