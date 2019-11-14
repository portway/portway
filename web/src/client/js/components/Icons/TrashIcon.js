import React from 'react'
import PropTypes from 'prop-types'

function TrashIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m19.7497 0c.5522847 0 1 .44771525 1 1l-.0007 4.625h8.376c.5128358 0 .9355072.38604019.9932723.88337887l.0067277.11662113c0 .55228475-.4477153 1-1 1h-1.813l.0007 23.375c0 .5522847-.4477153 1-1 1h-22.5c-.55228475 0-1-.4477153-1-1l-.0007-23.375h-1.812c-.51283584 0-.93550716-.38604019-.99327227-.88337887l-.00672773-.11662113c0-.55228475.44771525-1 1-1h8.374l.0007-4.625c0-.55228475.44771525-1 1-1zm5.563 7.625h-20.5v22.375h20.5zm-15.8752 4.0933c.51283584 0 .9355072.3860402.9932723.8833789l.0067277.1166211v12.188c0 .5522847-.44771525 1-1 1-.51283584 0-.93550716-.3860402-.99327227-.8833789l-.00672773-.1166211v-12.188c0-.5522847.44771525-1 1-1zm5.625 0c.5128358 0 .9355072.3860402.9932723.8833789l.0067277.1166211v12.188c0 .5522847-.4477153 1-1 1-.5128358 0-.9355072-.3860402-.9932723-.8833789l-.0067277-.1166211v-12.188c0-.5522847.4477153-1 1-1zm5.625 0c.5128358 0 .9355072.3860402.9932723.8833789l.0067277.1166211v12.188c0 .5522847-.4477153 1-1 1-.5128358 0-.9355072-.3860402-.9932723-.8833789l-.0067277-.1166211v-12.188c0-.5522847.4477153-1 1-1zm-1.9378-9.7183h-7.375v3.625h7.375z" fill={fill} fillRule="evenodd" transform="translate(3 2)"/>
      </svg>
    </div>
  )
}

TrashIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

TrashIcon.defaultProps = {
  className: 'icon-trash',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default TrashIcon
