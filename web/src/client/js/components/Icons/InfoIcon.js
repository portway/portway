import React from 'react'
import PropTypes from 'prop-types'

function FilterIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <g fill="none" fillRule="evenodd" transform="translate(2 2)">
          <path d="m12.3453 13.45v-1.4h5.099v11.625l1.924.475v1.4h-7.023v-1.4l1.924-.475v-9.75zm1.648-5.2c0-.533.164-.967.489-1.3.324-.333.779-.5 1.363-.5.583 0 1.041.167 1.375.5.333.333.5.767.5 1.3s-.163.963-.488 1.287c-.325.325-.788.488-1.387.488-.602 0-1.06-.163-1.375-.488-.318-.324-.477-.754-.477-1.287z" fill={fill}/>
          <path d="m31.9996 15.9998c0 8.836-7.163 16-16 16-8.836 0-16-7.164-16-16s7.164-16 16-16c8.837 0 16 7.164 16 16z" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
        </g>
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
  className: 'icon-info',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default FilterIcon
