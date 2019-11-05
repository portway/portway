import React from 'react'
import PropTypes from 'prop-types'

function DataIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width={width} height={height}>
        <path d="m31.5151515 31.5151515h-31.03030301v-31.03030301m4.84848484 21.33333331 7.75757577-7.7575757m0 0 5.8181818 4.8484848m7.7575758-8.7272727-7.7575758 8.7272727" fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="translate(2 2)"/>
      </svg>
    </div>
  )
}

DataIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

DataIcon.defaultProps = {
  className: 'icon-data',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default DataIcon


