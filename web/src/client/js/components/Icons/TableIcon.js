import React from 'react'
import PropTypes from 'prop-types'

function TableIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m0 24h36v-24h-36zm8-24v24m14-24v24m-22-18h36m0 6h-36m0 6h36" fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="translate(0 6)"/>
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
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default TableIcon
