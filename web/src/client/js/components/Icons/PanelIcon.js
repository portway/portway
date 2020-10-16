import React from 'react'
import PropTypes from 'prop-types'

function PanelIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36" className={className}>
        <path d="m2.67186852 29.8377405h30.35515898v-23.35135131h-30.35515898zm19.51732068-23.3517405v23.3513514m-19.17567569-23.33774059-.17567567-.01312432m.17567567 23.01312431-.17567567.338227m23.35135136-23.35135131h5.8378378m-5.8378378 23.35135131h5.8378378" fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
      </svg>
    </div>
  )
}

PanelIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

PanelIcon.defaultProps = {
  className: 'icon-panel',
  fill: 'var(--theme-icon-color)',
  height: '18',
  width: '18'
}

export default PanelIcon
