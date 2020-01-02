import React from 'react'
import PropTypes from 'prop-types'

function AddIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m17.8833789 1.00672773.1166211-.00672773c.5128358 0 .9355072.38604019.9932723.88337887l.0067277.11662113-.001 14.999 15.001.001c.5128358 0 .9355072.3860402.9932723.8833789l.0067277.1166211c0 .5128358-.3860402.9355072-.8833789.9932723l-.1166211.0067277-15.001-.001.001 15.001c0 .5128358-.3860402.9355072-.8833789.9932723l-.1166211.0067277c-.5128358 0-.9355072-.3860402-.9932723-.8833789l-.0067277-.1166211-.001-15.001-14.999.001c-.51283584 0-.93550716-.3860402-.99327227-.8833789l-.00672773-.1166211c0-.5128358.38604019-.9355072.88337887-.9932723l.11662113-.0067277 14.999-.001.001-14.999c0-.51283584.3860402-.93550716.8833789-.99327227l.1166211-.00672773z" fill={fill} fillRule="evenodd"/>
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
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F2F2F2' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default AddIcon
