import React from 'react'
import PropTypes from 'prop-types'

function FilterIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m25.5185185.48148148h-25.03703702m22.14814812 7.06188889h-19.25925923m15.40740743 7.06140743h-11.55555558m7.70370368 7.0618889h-3.8518518" fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="translate(5 7)"/>
      </svg>
    </div>
  )
}

FilterIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

FilterIcon.defaultProps = {
  className: 'icon-filter',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default FilterIcon
