import React from 'react'
import PropTypes from 'prop-types'

import NotificationComponent from './NotificationComponent'

const NotificationList = ({ dismissHandler, notifications }) => {
  console.log(notifications)
  const codeArray = []
  const trimmedNotificationsList = notifications.filter((note) => {
    if (!codeArray.includes(note.notification.code)) {
      codeArray.push(note.notification.code)
      return note
    }
  })
  console.log(trimmedNotificationsList)
  if (trimmedNotificationsList.length > 0) {
    return (
      <ol className="notifications__list">
        {trimmedNotificationsList.map((notification) => {
          return <NotificationComponent dismissHandler={dismissHandler} key={notification.id} id={notification.id} notification={notification.notification} />
        })}
      </ol>
    )
  } else {
    return null
  }
}

NotificationList.propTypes = {
  dismissHandler: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
}

export default NotificationList
