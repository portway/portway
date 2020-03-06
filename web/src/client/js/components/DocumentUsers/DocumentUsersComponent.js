import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './_DocumentUsers.scss'

const DIRECTION = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
}

const MODE = {
  FIELD: 'field',
  DOCUMENT: 'document'
}

const DocumentUsersComponent = ({ activeUsers, direction = DIRECTION.HORIZONTAL, mode = MODE.DOCUMENT }) => {
  const action = mode === MODE.FIELD ? 'editing' : 'viewing'
  const usersListClasses = cx({
    'document-users__list': true,
    'document-users__list--vertical': direction === DIRECTION.VERTICAL,
  })
  const usersListItemClasses = cx({
    'document-users__list-item': true,
    'document-users__list--field': mode === MODE.FIELD,
  })
  return (
    <div className="document-users">
      <ol className={usersListClasses}>
        {activeUsers && activeUsers.map((activeUser) => {
          if (activeUser) {
            if (activeUser.avatar) {
              return (
                <li className={usersListItemClasses} key={activeUser.id}>
                  <img
                    alt={activeUser.name}
                    aria-label={`Image of ${activeUser.name}`}
                    className="document-users__avatar"
                    height="32"
                    src={activeUser.avatar}
                    title={`${activeUser.name} is ${action} this document`}
                    width="32"
                  />
                </li>
              )
            }
            return (
              <li className={usersListItemClasses} key={activeUser.id}>
                <div
                  aria-label={`${activeUser.name}’s initial`}
                  className="document-users__placeholder"
                  title={`${activeUser.name} is ${action} this document`}
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
  direction: PropTypes.oneOf([DIRECTION.HORIZONTAL, DIRECTION.VERTICAL]),
  mode: PropTypes.oneOf([MODE.DOCUMENT, MODE.VERTICAL])
}

export default DocumentUsersComponent
