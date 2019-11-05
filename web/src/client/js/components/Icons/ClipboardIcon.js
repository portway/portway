import React from 'react'
import PropTypes from 'prop-types'

function ClipboardIcon({ className, fill, height, width }) {
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
        <g style={style} transform="translate(6 2)">
          <path d="m20.3007 5.5337h3.699v26.466h-24v-26.466h3.7"/>
          <path d="m19.748 2.7671h-4.483c-.264-1.568-1.621-2.767-3.264-2.767-1.644 0-3.001 1.199-3.265 2.767h-4.483l-1.107 5.534h1.107 15.495 1.106z"/>
          <path d="m5.0009 14.4214h14m-14 5.729h14m-14 5.7295h14"/>
        </g>
      </svg>
    </div>
  )
}

ClipboardIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

ClipboardIcon.defaultProps = {
  className: 'icon-clipboard',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default ClipboardIcon
