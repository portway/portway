import React from 'react'
import PropTypes from 'prop-types'

function BillingIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m16.9996-.0002c9.3882847 0 17 7.61171525 17 17 0 9.3882847-7.6117153 17-17 17-9.38894905 0-17-7.6113795-17-17 0-9.38862046 7.61105095-17 17-17zm0 2c-8.28436022 0-15 6.71592971-15 15 0 8.2840703 6.71563978 15 15 15 8.2837153 0 15-6.7162847 15-15 0-8.28371525-6.7162847-15-15-15zm8 7c1.6562847 0 3 1.3437153 3 3v10c0 1.6562847-1.3437153 3-3 3h-16c-1.65628475 0-3-1.3437153-3-3v-10c0-1.6562847 1.34371525-3 3-3zm1 6.06h-18v6.94c0 .5517153.44828475 1 1 1h16c.5517153 0 1-.4482847 1-1zm-2.4996 1.4402c.5522847 0 1 .4477153 1 1v3c0 .5522847-.4477153 1-1 1h-5c-.5522847 0-1-.4477153-1-1v-3c0-.5522847.4477153-1 1-1zm-1 2h-3v1h3zm2.4996-7.5002h-16c-.55171525 0-1 .4482847-1 1v1.06h18v-1.06c0-.5517153-.4482847-1-1-1z" fill={fill} fillRule="evenodd" transform="translate(1 1)"/>
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
