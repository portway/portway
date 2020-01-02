import React from 'react'
import PropTypes from 'prop-types'

function SearchIcon({ className, fill, height, width }) {
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m14.0909091.48484849c7.514709 0 13.6060606 6.09135161 13.6060606 13.60606061 0 3.3972747-1.2449464 6.5036445-3.303533 8.8878032l8.8288216 8.8293324c.3905243.3905243.3905243 1.0236893 0 1.4142136s-1.0236893.3905243-1.4142136 0l-8.8293324-8.8288216c-2.3841587 2.0585866-5.4905285 3.303533-8.8878032 3.303533-7.514709 0-13.60606061-6.0913516-13.60606061-13.6060606s6.09135161-13.60606061 13.60606061-13.60606061zm0 1.99999999c-6.4101395 0-11.60606062 5.19592112-11.60606062 11.60606062s5.19592112 11.6060606 11.60606062 11.6060606 11.6060606-5.1959211 11.6060606-11.6060606-5.1959211-11.60606062-11.6060606-11.60606062z" fill={fill} fillRule="evenodd" transform="translate(1 1)"/>
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
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F2F2F2' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default SearchIcon
