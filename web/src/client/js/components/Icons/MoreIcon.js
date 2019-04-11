/* eslint-disable max-len */
import React from 'react'
import PropTypes from 'prop-types'

function MoreIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width={width} height={height}>
        <path fill={fill} fillRule="evenodd" d="m18 21c-1.6568542 0-3-1.3431458-3-3s1.3431458-3 3-3 3 1.3431458 3 3-1.3431458 3-3 3zm10 0c-1.6568542 0-3-1.3431458-3-3s1.3431458-3 3-3 3 1.3431458 3 3-1.3431458 3-3 3zm-20 0c-1.65685425 0-3-1.3431458-3-3s1.34314575-3 3-3 3 1.3431458 3 3-1.34314575 3-3 3z" />
      </svg>
    </div>
  )
}

MoreIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

MoreIcon.defaultProps = {
  className: 'icon-more',
  fill: '#3b3d3e',
  height: '36',
  width: '36'
}

export default MoreIcon
