import React from 'react'
import PropTypes from 'prop-types'

function TimeIcon({ className, fill, height, width }) {
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
        <g style={style} transform="translate(2 2)">
          <path d="m31.5151515 16c0 8.5682424-6.9459394 15.5151515-15.5151515 15.5151515-8.56921212 0-15.51515151-6.9469091-15.51515151-15.5151515 0-8.56824242 6.94593939-15.51515151 15.51515151-15.51515151 8.5692121 0 15.5151515 6.94690909 15.5151515 15.51515151z"/>
          <path d="m23.5425939 23.5425939-7.542303-7.542303v-10.66666666"/>
        </g>
      </svg>
    </div>
  )
}

TimeIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

TimeIcon.defaultProps = {
  className: 'icon-time',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default TimeIcon
