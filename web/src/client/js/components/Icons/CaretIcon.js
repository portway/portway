import React from 'react'
import PropTypes from 'prop-types'

function CaretIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m18 24.5857864-15.29289322-15.29289318c-.39052429-.39052429-1.02368927-.39052429-1.41421356 0s-.39052429 1.02368928 0 1.41421358l15.99999998 16c.3905243.3905243 1.0236893.3905243 1.4142136 0l16-16c.3905243-.3905243.3905243-1.02368929 0-1.41421358s-1.0236893-.39052429-1.4142136 0z" fill={fill} fillRule="evenodd"/>
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

// Caret is special and is defaulting to 12 instead of 18 like all the rest
CaretIcon.defaultProps = {
  className: 'icon-caret',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '12',
  width: '12'
}

export default CaretIcon
