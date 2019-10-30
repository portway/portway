import React from 'react'
import PropTypes from 'prop-types'

function TagIcon({ className, fill, height, width }) {
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
        <g style={style} transform="translate(2 2)">
          <path d="m31.5151515 14.5894788-16.9250909 16.9260606-14.10521211-14.1052121 16.92509091-16.92509094m12.6951758 1.41013334-12.6952728-1.41090909m12.6952728 1.41090909 1.4099393 12.694303"/>
          <path d="m24.041697 7.95781818c1.324606 1.32557576 1.324606 3.47442422 0 4.80000002-1.3255758 1.3255757-3.4744243 1.3255757-4.8 0-1.3246061-1.3255758-1.3246061-3.47442426 0-4.80000002 1.3255757-1.32557576 3.4744242-1.32557576 4.8 0z"/>
        </g>
      </svg>
    </div>
  )
}

TagIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

TagIcon.defaultProps = {
  className: 'icon-tag',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default TagIcon
