import React from 'react'
import PropTypes from 'prop-types'

function ProjectIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width={width} height={height}>
        <path fill={fill} fillRule="evenodd" d="m23.1111111 20.6111111h12.3611111c.690356 0 1.25.5596441 1.25 1.25s-.559644 1.25-1.25 1.25h-12.3611111v12.3611111c0 .690356-.5596441 1.25-1.25 1.25s-1.25-.559644-1.25-1.25v-12.3611111h-12.3611111c-.69035594 0-1.25-.5596441-1.25-1.25s.55964406-1.25 1.25-1.25h12.3611111v-12.3611111c0-.69035594.5596441-1.25 1.25-1.25s1.25.55964406 1.25 1.25z" transform="matrix(.70710678 .70710678 -.70710678 .70710678 17.86147 -13.055403)"/>
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
  fill: '#3b3d3e',
  height: '36',
  width: '36'
}

export default ProjectIcon


