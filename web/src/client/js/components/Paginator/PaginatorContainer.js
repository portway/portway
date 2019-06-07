import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { parseParams, convertParams } from '../../utilities/queryParams'
import PaginatorComponent from './PaginatorComponent'

const PaginatorContainer = ({ count, history, limit = 10, location, onChange }) => {
  const queryParams = parseParams(location.search)
  const [currentPage, setCurrentPage] = useState(queryParams.page || 1)
  const totalPages = Math.ceil(count / limit)

  function pageChangeHandler(page) {
    if (page === currentPage) return
    queryParams.page = page
    setCurrentPage(page)
    onChange(page)
    history.push({ search: convertParams(queryParams) })
  }

  return (
    <PaginatorComponent
      changeHandler={pageChangeHandler}
      page={currentPage}
      pages={totalPages} />
  )
}

PaginatorContainer.propTypes = {
  count: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  limit: PropTypes.number,
  location: PropTypes.object.isRequired,
  onChange: PropTypes.func
}

export default withRouter(PaginatorContainer)
