import React from 'react'
import PropTypes from 'prop-types'

function BillingIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <g fill="none" fillRule="evenodd" transform="translate(2 2)">
          <g stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path d="m31.9996 15.9998c0 8.836-7.164 16-16 16-8.837 0-16-7.164-16-16s7.163-16 16-16c8.836 0 16 7.164 16 16z" />
            <path d="m17.5 19.5h5v-3h-5z" />
            <path d="m23.9996 22.9998h-16c-1.104 0-2-.896-2-2v-10c0-1.104.896-2 2-2h16c1.104 0 2 .896 2 2v10c0 1.104-.896 2-2 2z" />
          </g>
          <path d="m6 14.06h20v-2h-20z" fill={fill} />
        </g>
      </svg>
    </div>
  )
}

BillingIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

BillingIcon.defaultProps = {
  className: 'icon-billing',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default BillingIcon
