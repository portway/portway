import React from 'react'
import PropTypes from 'prop-types'

function APIKeyIcon({ className, fill, height, width }) {
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
          <path d="m25.0005 21.5057-4.198-4.195-3.907-3.909c.192-.566.299-1.172.299-1.805 0-3.091-2.507-5.597-5.598-5.597s-5.596 2.506-5.596 5.597c0 3.093 2.505 5.598 5.596 5.598h2.072c.011 0 .022.001.034.001.666.018 1.201.554 1.218 1.219l.002.002h2.195v2.194h2.194v2.195h2.194v2.194l3.445-.05zm-14.68-8.632c-.705-.705-.705-1.847 0-2.554.705-.703 1.849-.703 2.553 0 .704.707.704 1.849 0 2.554-.704.704-1.848.704-2.553 0z"/>
          <path d="m31.9996 15.9998c0 8.836-7.163 16-16 16s-16-7.164-16-16 7.163-16 16-16 16 7.164 16 16z"/>
        </g>
      </svg>
    </div>
  )
}

APIKeyIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

APIKeyIcon.defaultProps = {
  className: 'icon-api-keys',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default APIKeyIcon
