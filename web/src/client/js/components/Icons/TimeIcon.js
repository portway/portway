import React from 'react'
import PropTypes from 'prop-types'

function TimeIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36" className={className}>
        <g fill="none" fillRule="evenodd" stroke={fill} strokeLinecap="round" strokeWidth="3" transform="translate(3 3)">
          <circle cx="14.706" cy="14.706" r="14.706"/>
          <path d="m14.5 15.5v-10.93756574m6.2422701 16.46205204-5.7422701-5.0244863" strokeLinejoin="round"/>
        </g>
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
  fill: '#3b3d3e',
  height: '18',
  width: '18'
}

export default TimeIcon
