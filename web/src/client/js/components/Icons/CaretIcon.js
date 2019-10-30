import React from 'react'
import PropTypes from 'prop-types'

function CaretIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m34 10-16 16-16-16" fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
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
