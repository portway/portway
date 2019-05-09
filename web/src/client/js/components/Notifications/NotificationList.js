import React from 'react'
import PropTypes from 'prop-types'

import NotificationComponent from './NotificationComponent'

const NotificationList = ({ dismissHandler, notifications }) => {
  function renderNotices() {
    return notifications.map((notification) => {
      return <NotificationComponent dismissHandler={dismissHandler} key={notification.id} id={notification.id} notification={notification.notification} />
    })
  }
  if (notifications.length > 0) {
    return (
      <ol className="notifications__list">
        {renderNotices()}
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
