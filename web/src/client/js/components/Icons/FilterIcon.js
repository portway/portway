import React from 'react'
import PropTypes from 'prop-types'

function FilterIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path fill={fill} fillRule="evenodd" d="M2,2.75 C1.30964406,2.75 0.75,2.19035594 0.75,1.5 C0.75,0.809644063 1.30964406,0.25 2,0.25 L28,0.25 C28.6903559,0.25 29.25,0.809644063 29.25,1.5 C29.25,2.19035594 28.6903559,2.75 28,2.75 L2,2.75 Z M6,9.75 C5.30964406,9.75 4.75,9.19035594 4.75,8.5 C4.75,7.80964406 5.30964406,7.25 6,7.25 L24,7.25 C24.6903559,7.25 25.25,7.80964406 25.25,8.5 C25.25,9.19035594 24.6903559,9.75 24,9.75 L6,9.75 Z M10,16.75 C9.30964406,16.75 8.75,16.1903559 8.75,15.5 C8.75,14.8096441 9.30964406,14.25 10,14.25 L20,14.25 C20.6903559,14.25 21.25,14.8096441 21.25,15.5 C21.25,16.1903559 20.6903559,16.75 20,16.75 L10,16.75 Z M13,23.75 C12.3096441,23.75 11.75,23.1903559 11.75,22.5 C11.75,21.8096441 12.3096441,21.25 13,21.25 L17,21.25 C17.6903559,21.25 18.25,21.8096441 18.25,22.5 C18.25,23.1903559 17.6903559,23.75 17,23.75 L13,23.75 Z" transform="translate(3 6)"/>
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
