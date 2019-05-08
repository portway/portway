import React from 'react'
import PropTypes from 'prop-types'

function ExpandIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36" className={className}>
        <path fill={fill} d="m28.5 7.5h-8.5c-.8284271 0-1.5-.67157288-1.5-1.5s.6715729-1.5 1.5-1.5h11.5v11.5c0 .8284271-.6715729 1.5-1.5 1.5s-1.5-.6715729-1.5-1.5zm-21 21h8.5c.8284271 0 1.5.6715729 1.5 1.5s-.6715729 1.5-1.5 1.5h-11.5v-11.5c0-.8284271.67157288-1.5 1.5-1.5s1.5.6715729 1.5 1.5z" transform="matrix(0 1 -1 0 36 0)"/>
      </svg>
    </div>
  )
}

ExpandIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

ExpandIcon.defaultProps = {
  className: 'icon-expand',
  fill: '#3b3d3e',
  height: '18',
  width: '18'
}

export default ExpandIcon
