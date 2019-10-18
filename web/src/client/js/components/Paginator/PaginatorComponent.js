import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './_Paginator.scss'

const PaginatorComponent = ({ changeHandler, page, pages }) => {
  function renderPageItems() {
    const listItems = []
    for (let index = 1; index <= pages; index++) {
      const current = index === page
      const pageClasses = cx({
        'paginator__page': true,
        'paginator__page--current': current
      })
      const labelAttribute = cx({
        'Current page, ': current,
        [`Page ${index}`]: true
      })
      listItems.push(
        <li
          key={`page-${index}`}
          className={pageClasses}
          aria-current={current}
          aria-label={labelAttribute}>
          <button className="btn btn--blank" onClick={() => changeHandler(index)}>{index}</button>
        </li>
      )
    }
    return listItems.length > 1 ? listItems : null
  }

  return (
    <nav className="paginator" aria-label="Pagination Navigation" role="navigation">
      <ol className="paginator__list">
        {renderPageItems()}
      </ol>
    </nav>
  )
}

PaginatorComponent.propTypes = {
  changeHandler: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired
}

export default PaginatorComponent
