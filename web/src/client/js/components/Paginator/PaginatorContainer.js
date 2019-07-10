import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { parseParams, convertParams } from '../../utilities/queryParams'
import PaginatorComponent from './PaginatorComponent'

const PaginatorContainer = ({ totalPages, history, location, onChange }) => {
  const queryParams = parseParams(location.search)
  const currentPage = Number(queryParams.page || 1)
  if (!totalPages) return null

  function pageChangeHandler(page) {
    if (page === currentPage) return
    queryParams.page = Number(page)
    onChange && onChange(page)
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
  totalPages: PropTypes.number,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  onChange: PropTypes.func
}

export default withRouter(PaginatorContainer)
