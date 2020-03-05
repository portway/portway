import React from 'react'
import PropTypes from 'prop-types'

import './_DocumentUsers.scss'

const DocumentUsersComponent = ({ activeUsers }) => {
  return (
    <div className="document-users">
      <ol className="document-users__list">
        {activeUsers && activeUsers.map((activeUser) => {
          if (activeUser) {
            if (activeUser.avatar) {
              return (
                <li className="document-users__list-item" key={activeUser.id}>
                  <img
                    alt={activeUser.name}
                    aria-label={`Image of ${activeUser.name}`}
                    className="document-users__avatar"
                    height="32"
                    src={activeUser.avatar}
                    title={`${activeUser.name} is viewing this document`}
                    width="32"
                  />
                </li>
              )
            }
            return (
              <li className="document-users__list-item" key={activeUser.id}>
                <div
                  aria-label={`${activeUser.name}’s initial`}
                  className="document-users__placeholder"
                  title={`${activeUser.name} is viewing this document`}
                >
                  {activeUser.name.charAt(0)}
                </div>
              </li>
            )
          }
        })}
      </ol>
    </div>
  )
}

DocumentUsersComponent.propTypes = {
  activeUsers: PropTypes.array,
}

export default DocumentUsersComponent
