import React from 'react'
import PropTypes from 'prop-types'

function ArrowIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  // this arrow is down
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m31.5151515 15.9996121-15.5151515 15.5151515-15.51515151-15.5151515m15.51515151 15.5151515v-31.03030299" fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="translate(2 2)"/>
      </svg>
    </div>
  )
}

ArrowIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

ArrowIcon.defaultProps = {
  className: 'icon-arrow',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default ArrowIcon
