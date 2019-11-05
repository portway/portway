import React from 'react'
import PropTypes from 'prop-types'

function ProjectIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width={width} height={height}>
        <path d="m.48.48 23.04 23.04m-23.04 0 23.04-23.04" fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="translate(6 6)"/>
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


