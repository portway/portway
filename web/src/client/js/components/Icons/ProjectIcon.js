import React from 'react'
import PropTypes from 'prop-types'

function ProjectIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36" className={className}>
        <path fill={fill} fillRule="evenodd" d="M8.074 22.701v5.03h1.573a1.25 1.25 0 1 1 0 2.5H8.074v.004c0 1.036.852 1.888 1.886 1.888h18.824a1.887 1.887 0 0 0 1.887-1.888V5.138a1.897 1.897 0 0 0-1.887-1.888H9.96a1.887 1.887 0 0 0-1.886 1.888v.004h1.573a1.25 1.25 0 1 1 0 2.5H8.074v5.03h1.573a1.25 1.25 0 1 1 0 2.5H8.074v5.03h1.573a1.25 1.25 0 0 1 0 2.5H8.074zm-2.5-2.5v-5.03H4a1.25 1.25 0 0 1 0-2.5h1.574V7.643H4a1.25 1.25 0 1 1 0-2.5h1.574v-.004A4.387 4.387 0 0 1 9.96.75h18.824a4.397 4.397 0 0 1 4.387 4.388v25.097a4.387 4.387 0 0 1-4.387 4.388H9.96a4.397 4.397 0 0 1-4.386-4.388v-.004H4a1.25 1.25 0 0 1 0-2.5h1.574V22.7H4a1.25 1.25 0 1 1 0-2.5h1.574zm19.136-5.816a4.397 4.397 0 1 0-8.794 0 4.397 4.397 0 0 0 8.794 0zm2.5 0a6.898 6.898 0 1 1-13.795-.002 6.898 6.898 0 0 1 13.795.002zm-1.25 9.894a1.25 1.25 0 1 1 0 2.5H14.666a1.25 1.25 0 0 1 0-2.5H25.96z"/>
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
  height: '18',
  width: '18'
}

export default ProjectIcon
