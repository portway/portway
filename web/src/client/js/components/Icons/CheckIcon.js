import React from 'react'
import PropTypes from 'prop-types'

function CheckIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path fill={fill} fillRule="evenodd" transform="translate(4 8)" d="m26.7704375-.88388348c.4881554-.48815536 1.2796116-.48815536 1.767767 0 .4881553.48815537.4881553 1.27961159 0 1.76776696l-19.89622919 19.89622912-9.52585879-9.5258588c-.48815536-.4881553-.48815536-1.27961154 0-1.76776691.48815537-.48815536 1.27961159-.48815536 1.76776696 0l7.75809183 7.75809181z" />
      </svg>
    </div>
  )
}

CheckIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

CheckIcon.defaultProps = {
  className: 'icon-check',
  fill: '#3b3d3e',
  height: '18',
  width: '18'
}

export default CheckIcon
