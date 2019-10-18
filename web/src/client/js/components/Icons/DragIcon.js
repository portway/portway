import React from 'react'
import PropTypes from 'prop-types'

function DragIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <g fill="none" fillRule="evenodd" stroke={fill} strokeLinecap="round" strokeWidth="3" transform="translate(6 9)">
          <path d="m0 8.83333333h24"/>
          <path d="m0 .83333333h24"/>
          <path d="m0 17 24-.1666667"/>
        </g>
      </svg>
    </div>
  )
}

DragIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

DragIcon.defaultProps = {
  className: 'icon-drag',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default DragIcon
