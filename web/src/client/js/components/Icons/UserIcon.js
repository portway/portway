/* eslint-disable max-len */
import React from 'react'
import PropTypes from 'prop-types'

function UserIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={width} viewBox="0 0 37 37">
        <g fill="none" fillRule="evenodd" stroke={fill} strokeLinecap="round" strokeWidth="3" transform="translate(2 2)">
          <path d="M5.86666667,28.3333333 C6.93333333,24.6666667 8.93333333,23.3333333 11.2333333,23.3333333 L22.1,23.3333333 C24.4,23.3333333 26.4,24.6666667 27.4666667,28.3333333"/>
          <circle cx="16.667" cy="13.333" r="5"/>
          <circle cx="16.667" cy="16.667" r="16.667"/>
        </g>
      </svg>
    </div>
  )
}

UserIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

UserIcon.defaultProps = {
  className: 'icon-user',
  fill: '#3b3d3e',
  height: '36',
  width: '36'
}

export default UserIcon
