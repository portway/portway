import React from 'react'
import PropTypes from 'prop-types'

function DocumentIcon({ className, fill, height, width }) {
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
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36" className={className}>
        <g style={style} transform="translate(5 2)">
          <path d="m4.9998 24h16m-16-7h16m-10-7h-6"/>
          <path d="m25.9998 32h-26v-32h16l10 10z"/>
          <path d="m25.9998 10h-10v-10"/>
        </g>
      </svg>
    </div>
  )
}

DocumentIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

DocumentIcon.defaultProps = {
  className: 'icon-document',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default DocumentIcon
