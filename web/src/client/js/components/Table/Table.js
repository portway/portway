import React from 'react'
import PropTypes from 'prop-types'

const Table = ({ children }) => {
  return (
    <table>
      {children}
    </table>
  )
}

Table.propTypes = {
  children: PropTypes.node
}

export default Table
