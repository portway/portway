import React from 'react'
import PropTypes from 'prop-types'

function ProjectIcon({ className, fill, height, width }) {
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
        <g style={style} transform="translate(2 6)">
          <path d="m27.9678 7.9909v-3.996h-15.347l-.999-3.995h-11.622v24.971"/>
          <path d="m4.0322 7.9909h27.968l-4.032 16.98h-27.968z"/>
        </g>
      </svg>
    </div>
  )
}

ProjectIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

ProjectIcon.defaultProps = {
  className: 'icon-project',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default ProjectIcon
