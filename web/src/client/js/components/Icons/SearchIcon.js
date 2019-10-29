import React from 'react'
import PropTypes from 'prop-types'

function SearchIcon({ className, fill, height, width }) {
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m25.6969697 13.0909091c0 6.9624242-5.6436364 12.6060606-12.6060606 12.6060606-6.96242425 0-12.60606061-5.6436364-12.60606061-12.6060606 0-6.96242425 5.64363636-12.60606061 12.60606061-12.60606061 6.9624242 0 12.6060606 5.64363636 12.6060606 12.60606061zm5.8181818 18.4242424-9.5107879-9.5107879" fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="translate(2 2)"/>
      </svg>
    </div>
  )
}

SearchIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

SearchIcon.defaultProps = {
  className: 'icon-search',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default SearchIcon
