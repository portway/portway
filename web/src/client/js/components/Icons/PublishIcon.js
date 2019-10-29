import React from 'react'
import PropTypes from 'prop-types'

function PublishIcon({ className, fill, height, width }) {
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
        <g style={style} transform="translate(2 3)">
          <path d="m12.9958 18.0005 18-18m.034 11.636v-11.636h-11.636"/>
          <path d="m25.2117 18.3892v12.606h-12.605-12.607v-12.606-12.605h12.607"/>
        </g>
      </svg>
    </div>
  )
}

PublishIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

PublishIcon.defaultProps = {
  className: 'icon-publish',
  fill: '#3b3d3e',
  height: '18',
  width: '18'
}

export default PublishIcon
