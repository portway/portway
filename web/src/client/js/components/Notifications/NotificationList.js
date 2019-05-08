import React from 'react'
import PropTypes from 'prop-types'

import NotificationComponent from './NotificationComponent'

const NotificationList = ({ notifications }) => {
  function renderNotices() {
    return notifications.map((notice, index) => {
      return <NotificationComponent key={index} id={`notice-${index}`} notice={notice} />
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
  notifications: PropTypes.array.isRequired
}

export default NotificationList
