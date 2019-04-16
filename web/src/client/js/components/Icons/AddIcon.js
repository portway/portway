import React from 'react'
import PropTypes from 'prop-types'

function AddIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 36 36">
        <path
          fill={fill}
          fillRule="evenodd"
          d="M16.8611111,14.3611111 L29.2222222,14.3611111 C29.9125782,14.3611111 30.4722222,14.9207552 30.4722222,15.6111111 C30.4722222,16.301467 29.9125782,16.8611111 29.2222222,16.8611111 L16.8611111,16.8611111 L16.8611111,29.2222222 C16.8611111,29.9125782 16.301467,30.4722222 15.6111111,30.4722222 C14.9207552,30.4722222 14.3611111,29.9125782 14.3611111,29.2222222 L14.3611111,16.8611111 L2,16.8611111 C1.30964406,16.8611111 0.75,16.301467 0.75,15.6111111 C0.75,14.9207552 1.30964406,14.3611111 2,14.3611111 L14.3611111,14.3611111 L14.3611111,2 C14.3611111,1.30964406 14.9207552,0.75 15.6111111,0.75 C16.301467,0.75 16.8611111,1.30964406 16.8611111,2 L16.8611111,14.3611111 Z"
          transform="translate(2 2)"
        />
      </svg>
    </div>
  )
}

AddIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

AddIcon.defaultProps = {
  className: 'icon-add',
  fill: '#3b3d3e',
  height: '36',
  width: '36'
}

export default AddIcon
