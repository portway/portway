import React from 'react'
import PropTypes from 'prop-types'

function OrganizationIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width={width} height={height}>
        <g fill="none" fillRule="evenodd" transform="translate(2 2)">
          <g stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path d="m32.0003 15.9998c0 8.836-7.163 16-16 16s-16-7.164-16-16 7.163-16 16-16 16 7.164 16 16z"/>
            <path d="m8.0013 6.9998h16zm-1 18h18zm2 0h14v-18h-14z"/>
            <path d="m13.501 25h5v-6h-5z"/>
          </g>
          <path d="m17.001 14v2h-2v-2zm-3 0v2h-2v-2zm6 0v2h-2v-2zm-3-4v2h-2v-2zm-3 0v2h-2v-2zm6 0v2h-2v-2z" fill={fill}/>
        </g>
      </svg>
    </div>
  )
}

OrganizationIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

OrganizationIcon.defaultProps = {
  className: 'icon-organization',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default OrganizationIcon
