import React from 'react'
import PropTypes from 'prop-types'

function CaretIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path fill={fill} fillRule="evenodd" d="M18,23.232233 L31.1161165,10.1161165 C31.6042719,9.62796116 32.3957281,9.62796116 32.8838835,10.1161165 C33.3720388,10.6042719 33.3720388,11.3957281 32.8838835,11.8838835 L18,26.767767 L3.11611652,11.8838835 C2.62796116,11.3957281 2.62796116,10.6042719 3.11611652,10.1161165 C3.60427189,9.62796116 4.39572811,9.62796116 4.88388348,10.1161165 L18,23.232233 Z"/>
      </svg>
    </div>
  )
}

CaretIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

CaretIcon.defaultProps = {
  className: 'icon-caret',
  fill: '#3b3d3e',
  height: '36',
  width: '36'
}

export default CaretIcon
