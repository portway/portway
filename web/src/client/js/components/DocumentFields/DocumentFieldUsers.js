import React from 'react'
import PropTypes from 'prop-types'

const DocumentFieldUsers = ({ users }) => {
  return (
    <div className="document-field-users">
      <ol>
        {users && users.map((user) => {
          if (user) {
            if (user.avatar) {
              return (
                <li key={`dfu-${user.id}`}>
                  <img
                    alt={user.name}
                    aria-label={`Image of ${user.name}`}
                    className="document-field-users__avatar"
                    height="32"
                    src={user.avatar}
                    title={`${user.name} is active in this field`}
                    width="32"
                  />
                </li>
              )
            }
            return (
              <li key={`dfu-${user.id}`}>
                <div
                  aria-label={`${user.name}’s initial`}
                  className="document-field-users__placeholder"
                  title={`${user.name} is active in this field`}
                >
                  {user.name.charAt(0)}
                </div>
              </li>
            )
          }
        })}
      </ol>
    </div>
  )
}

DocumentFieldUsers.propTypes = {
  users: PropTypes.array,
}

export default DocumentFieldUsers
