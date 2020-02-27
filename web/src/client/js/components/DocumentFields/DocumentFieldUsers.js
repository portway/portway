import React from 'react'
import PropTypes from 'prop-types'

const DocumentFieldUsers = ({ users }) => {
  return (
    <div className="document-field-users">
      <ol>
        {users.map((user) => {
          return <li key={`dfu-${user}`}>{user}</li>
        })}
      </ol>
    </div>
  )
}

DocumentFieldUsers.propTypes = {
  users: PropTypes.array,
}

export default DocumentFieldUsers
