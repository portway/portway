import React from 'react'
import PropTypes from 'prop-types'

function TrashIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m9.3747 0h9.375v5.625h6.563v24.375h-22.5v-24.375h6.562zm-9.3747 5.625h28.125m-19.6875 18.2813v-12.188m5.625 12.188v-12.188m5.625 12.188v-12.188" fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="translate(4 3)"/>
      </svg>
    </div>
  )
}

TrashIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

TrashIcon.defaultProps = {
  className: 'icon-trash',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default TrashIcon
