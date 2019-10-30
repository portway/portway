import React from 'react'
import PropTypes from 'prop-types'

function SortIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m16 13.0909091v14.5454545m0-27.15151511v7.75757575m-4.8484848 0h9.6969696m5.8181819-7.75757575v14.54545451m-4.8484849 4.8484849h9.6969697m-4.8484848 0v7.7575757m-21.33333337-27.15151511v10.66666671m-4.84848484 4.8484848h9.69696971m-4.84848487 0v11.6363636" fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="translate(2 4)"/>
      </svg>
    </div>
  )
}

SortIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

SortIcon.defaultProps = {
  className: 'icon-sort',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default SortIcon
