import React from 'react'
import PropTypes from 'prop-types'

function ProjectIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width={width} height={height}>
        <path d="m-.11029539.06710056.08318861-.09420734c.36048396-.36048396.92771502-.3882135 1.32000622-.08318861l.09420734.08318861 15.61289322 15.61210678 15.6128932-15.61210678c.360484-.36048396.927715-.3882135 1.3200062-.08318861l.0942074.08318861c.3604839.36048396.3882135.92771502.0831886 1.32000622l-.0831886.09420734-15.6131068 15.61289322 15.6131068 15.6128932c.3604839.360484.3882135.927715.0831886 1.3200062l-.0831886.0942074c-.360484.3604839-.927715.3882135-1.3200062.0831886l-.0942074-.0831886-15.6128932-15.6131068-15.61289322 15.6131068c-.36048396.3604839-.92771502.3882135-1.32000622.0831886l-.09420734-.0831886c-.36048396-.360484-.3882135-.927715-.08318861-1.3200062l.08318861-.0942074 15.61210678-15.6128932-15.61210678-15.61289322c-.36048396-.36048396-.3882135-.92771502-.08318861-1.32000622l.08318861-.09420734z" fill={fill} fillRule="evenodd" transform="translate(1 1)"/>
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


