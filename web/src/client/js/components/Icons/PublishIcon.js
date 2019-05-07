import React from 'react'
import PropTypes from 'prop-types'

function PublishIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36" className={className}>
        <path fill={fill} d="m29.3786797 4.5h-6.3786797c-.8284271 0-1.5-.67157288-1.5-1.5s.6715729-1.5 1.5-1.5h11.5v11.5c0 .8284271-.6715729 1.5-1.5 1.5s-1.5-.6715729-1.5-1.5v-6.37867966l-15.7726732 15.77267316c-.5857864.5857864-1.5355339.5857864-2.1213203 0s-.5857864-1.5355339 0-2.1213203zm-2.8786797 16.8333333c0-.8284271.6715729-1.5 1.5-1.5s1.5.6715729 1.5 1.5v8.3333334c0 2.6693763-2.163957 4.8333333-4.8333333 4.8333333h-18.33333337c-2.66937629 0-4.83333333-2.163957-4.83333333-4.8333333v-18.3333334c0-2.66176042 2.17157288-4.8333333 4.83333333-4.8333333h8.33333337c.8284271 0 1.5.67157288 1.5 1.5s-.6715729 1.5-1.5 1.5h-8.33333337c-1.00490621 0-1.83333333.8284271-1.83333333 1.8333333v18.3333334c0 1.012522.82081129 1.8333333 1.83333333 1.8333333h18.33333337c1.012522 0 1.8333333-.8208113 1.8333333-1.8333333z" />
      </svg>
    </div>
  )
}

PublishIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

PublishIcon.defaultProps = {
  className: 'icon-publish',
  fill: '#3b3d3e',
  height: '18',
  width: '18'
}

export default PublishIcon
