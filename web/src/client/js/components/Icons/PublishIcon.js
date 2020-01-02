import React from 'react'
import PropTypes from 'prop-types'

function PublishIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36" className={className}>
        <path d="m13.6067 5.7842c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1h-11.607v23.211h23.212v-11.606c0-.5522847.4477153-1 1-1s1 .4477153 1 1v12.606c0 .5522847-.4477153 1-1 1h-25.212c-.55228475 0-1-.4477153-1-1v-25.211c0-.55228475.44771525-1 1-1zm18.4231-5.7837c.5128358 0 .9355072.38604019.9932723.88337888l.0067277.11662112v11.636c0 .5522847-.4477153 1-1 1-.5128358 0-.9355072-.3860402-.9932723-.8833789l-.0067277-.1166211-.0008-9.2565-16.3260932 16.3276068c-.360484.3604839-.927715.3882135-1.3200062.0831886l-.0942074-.0831886c-.3604839-.360484-.3882135-.927715-.0831886-1.3200062l.0831886-.0942074 16.2933068-16.2933932-9.1882.0005c-.5128358 0-.9355072-.38604019-.9932723-.88337887l-.0067277-.11662113c0-.51283584.3860402-.93550716.8833789-.99327227l.1166211-.00672773z" fill={fill} fillRule="evenodd" transform="translate(1 2)"/>
      </svg>
    </div>
  )
}

PublishIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

PublishIcon.defaultProps = {
  className: 'icon-publish',
  fill: '#3b3d3e',
  height: '18',
  width: '18'
}

export default PublishIcon
