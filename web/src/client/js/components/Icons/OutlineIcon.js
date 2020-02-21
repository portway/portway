import React from 'react'
import PropTypes from 'prop-types'

function OutlineIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <g fill="none" fillRule="evenodd" transform="translate(5 5)">
          <g stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path d="m26 3.5h-18"/>
            <path d="m26 13.5h-18"/>
            <path d="m26 23.5h-18"/>
          </g>
          <path d="m6 3.5c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3m0 10c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3m0 10c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3" fill={fill} />
        </g>
      </svg>
    </div>
  )
}

OutlineIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

OutlineIcon.defaultProps = {
  className: 'icon-outline',
  fill: 'var(--theme-icon-color)',
  height: '18',
  width: '18'
}

export default OutlineIcon
