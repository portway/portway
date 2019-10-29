import React from 'react'
import PropTypes from 'prop-types'

function LockIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  const style = {
    stroke: fill,
    strokeWidth: 2,
    fill: 'none',
    fillRule: 'evenodd',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <g style={style} transform="translate(5 3)">
          <path d="m0 31h25v-18h-25z"/>
          <path d="m19.9997 13v-5.5c0-4.142-3.357-7.5-7.5-7.5-4.142 0-7.5 3.358-7.5 7.5v5.5"/>
        </g>
      </svg>
    </div>
  )
}

LockIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

LockIcon.defaultProps = {
  className: 'icon-lock',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default LockIcon
