import React from 'react'
import PropTypes from 'prop-types'

function InfoIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m16.9996-.0002c9.3889491 0 17 7.61137954 17 17 0 9.3886205-7.6110509 17-17 17-9.38828475 0-17-7.6117153-17-17 0-9.38828475 7.61171525-17 17-17zm0 2c-8.28371525 0-15 6.71628475-15 15 0 8.2837153 6.71628475 15 15 15 8.2843602 0 15-6.7159297 15-15 0-8.28407029-6.7156398-15-15-15zm1.4447 11.0502v11.625l1.924.475v1.4h-7.023v-1.4l1.924-.475v-9.75l-1.924-.475v-1.4zm-1.599-5.6c.583 0 1.041.167 1.375.5.333.333.5.767.5 1.3s-.163.963-.488 1.287c-.325.325-.788.488-1.387.488-.602 0-1.06-.163-1.375-.488-.318-.324-.477-.754-.477-1.287s.164-.967.489-1.3c.324-.333.779-.5 1.363-.5z" fill={fill} fillRule="evenodd" transform="translate(1 1)"/>
      </svg>
    </div>
  )
}

InfoIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

InfoIcon.defaultProps = {
  className: 'icon-info',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default InfoIcon
