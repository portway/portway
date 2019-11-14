import React from 'react'
import PropTypes from 'prop-types'

function TimeIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36" className={className}>
        <path d="m17 .48484849c9.1211716 0 16.5151515 7.39429909 16.5151515 16.51515151 0 9.1208524-7.3939799 16.5151515-16.5151515 16.5151515-9.12117164 0-16.51515151-7.3942991-16.51515151-16.5151515 0-9.12085242 7.39397987-16.51515151 16.51515151-16.51515151zm0 1.99999999c-8.01658281 0-14.51515152 6.49884927-14.51515152 14.51515152 0 8.0163023 6.49856871 14.5151515 14.51515152 14.5151515 8.0165828 0 14.5151515-6.4988492 14.5151515-14.5151515 0-8.01630225-6.4985687-14.51515152-14.5151515-14.51515152zm.0002909 2.84877576c.5522848 0 1 .44771525 1 1v10.25245306l7.2494098 7.2494099c.3905243.3905242.3905243 1.0236892 0 1.4142135s-1.0236893.3905243-1.4142135 0l-7.5423031-7.542303c-.1875364-.1875364-.2928932-.4418903-.2928932-.7071068v-10.66666666c0-.55228475.4477153-1 1-1z" fill={fill} fillRule="evenodd" transform="translate(1 1)"/>
      </svg>
    </div>
  )
}

TimeIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

TimeIcon.defaultProps = {
  className: 'icon-time',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F2F2F2' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default TimeIcon
