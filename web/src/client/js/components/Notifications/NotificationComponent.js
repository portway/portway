import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { RemoveIcon } from 'Components/Icons'

const NotificationComponent = ({ dismissHandler, id, notice }) => {
  const noticeClasses = cx({
    'notifications__notice': true,
    'notifications__notice--error': notice.type === 'error',
    'notifications__notice--success': notice.type === 'success',
    'notifications__notice--warning': notice.type === 'warning'
  })
  const noticeRef = useRef()
  const title = `${id}-title`
  const desc = `${id}-desc`
  let noticeTitle
  switch (notice.code) {
    case 403:
      noticeTitle = 'Access denied...'
      break
    case 404:
      noticeTitle = 'Not found...'
    case 409:
      noticeTitle = 'Conflict...'
    case 500:
      noticeTitle = 'Internal error...'
      break
    default:
      noticeTitle = 'Notice'
      break
  }
  function dismissNotice() {
    noticeRef.current.classList.add('notifications__notice--dismissed')
    dismissHandler(id)
  }
  return (
    <li ref={noticeRef} className={noticeClasses} role="alertdialog" aria-labelledby={title} aria-describedby={desc}>
      <button className="btn btn--blank btn--with-circular-icon notifications__remove" onClick={dismissNotice}>
        <RemoveIcon />
      </button>
      <div className="notifications__content">
        <h2 id={title} className="notifications__title">{noticeTitle}</h2>
        <p id={desc} className="notifications__message">{notice.message}</p>
        {notice.code && <span className="notifications__code note">Error code: {notice.code}</span> }
      </div>
    </li>
  )
}

NotificationComponent.propTypes = {
  dismissHandler: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  notice: PropTypes.shape({
    code: PropTypes.number,
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  })
}

export default NotificationComponent
