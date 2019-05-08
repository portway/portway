import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { RemoveIcon } from 'Components/Icons'

const NotificationComponent = ({ id, notice }) => {
  const noticeClasses = cx({
    'notifications__notice': true,
    'notifications__notice--error': notice.type === 'error',
    'notifications__notice--success': notice.type === 'success',
    'notifications__notice--warning': notice.type === 'warning'
  })
  const title = `${id}-title`
  const desc = `${id}-desc`
  return (
    <li className={noticeClasses} role="alertdialog" aria-labelledby={title} aria-describedby={desc}>
      <button className="btn btn--blank btn--with-circular-icon notifications__remove"><RemoveIcon /></button>
      <div className="notifications__content">
        <h2 id={title} className="notifications__title">{notice.type}</h2>
        <p id={desc} className="notifications__message">{notice.message}</p>
        {notice.code && <span className="notifications__code note">Error code: {notice.code}</span> }
      </div>
    </li>
  )
}

NotificationComponent.propTypes = {
  id: PropTypes.string.isRequired,
  notice: PropTypes.shape({
    code: PropTypes.number,
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  })
}

export default NotificationComponent
