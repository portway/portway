import React from 'react'
import PropTypes from 'prop-types'

function DropIcon({ className, fill, height, width }) {
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
        <g style={style} transform="translate(2 3)">
          <path d="m22.6527 3.8786h8.378v27.151h-31.03v-27.151h8.376"/>
          <path d="m24.2426 15.0299-8.728 8.728-8.727-8.728m8.7274 8.2432v-23.273"/>
        </g>
      </svg>
    </div>
  )
}

DropIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

DropIcon.defaultProps = {
  className: 'icon-drop',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default DropIcon
