import React from 'react'
import PropTypes from 'prop-types'

const DocumentUsersComponent = ({ activeUsers }) => {
  return (
    <div className="document-users">
      {activeUsers && activeUsers.map((activeUser) => {
        return <img key={activeUser.id} src={activeUser.avatar} width="48" height="48" alt={activeUser.name} />
      })}
    </div>
  )
}

DocumentUsersComponent.propTypes = {
  activeUsers: PropTypes.array,
}

export default DocumentUsersComponent
