import React from 'react'
import PropTypes from 'prop-types'

function TableIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m37 0c.5522847 0 1 .44771525 1 1v24c0 .5522847-.4477153 1-1 1h-36c-.55228475 0-1-.4477153-1-1v-24c0-.55228475.44771525-1 1-1zm-29 20h-6v4h6zm14 0h-12v4h12zm14 0h-12v4h12zm-28-6h-6v4h6zm14 0h-12v4h12zm14 0h-12v4h12zm-28-6h-6v4h6zm14 0h-12v4h12zm14 0h-12v4h12zm-28-6h-6v4h6zm14 0h-12v4h12zm14 0h-12v4h12z" fill={fill} fillRule="evenodd" transform="translate(-1 5)"/>
      </svg>
    </div>
  )
}

TableIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

TableIcon.defaultProps = {
  className: 'icon-table',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F2F2F2' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default TableIcon
