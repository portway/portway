import React from 'react'
import PropTypes from 'prop-types'

const DocumentUsersComponent = ({ activeUsers }) => {
  return (
    <div className="document-users">
      {activeUsers}
    </div>
  )
}

DocumentUsersComponent.propTypes = {
  activeUsers: PropTypes.array,
}

export default DocumentUsersComponent
