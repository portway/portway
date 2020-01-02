import React from 'react'
import PropTypes from 'prop-types'

function CheckIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m12.6669834 26.9197699-9.95987662-9.9598767c-.39052429-.3905243-1.02368927-.3905243-1.41421356 0s-.39052429 1.0236893 0 1.4142136l10.66699998 10.667c.3905308.3905307 1.0237085.3905233 1.4142302-.0000166l21.333-21.33399999c.3905151-.39053345.3905003-1.02369842-.0000332-1.41421356-.3905334-.39051514-1.0236984-.3905003-1.4142136.00003314z" fill={fill} fillRule="evenodd"/>
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
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F2F2F2' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default CheckIcon
