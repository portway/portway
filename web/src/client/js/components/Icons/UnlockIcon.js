import React from 'react'
import PropTypes from 'prop-types'

function UnlockIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m13.4997 0c4.69496 0 8.5 3.80539047 8.5 8.5 0 .55228475-.4477153 1-1 1s-1-.44771525-1-1c0-3.59008127-2.9096507-6.5-6.5-6.5-3.58971525 0-6.5 2.91028475-6.5 6.5l-.0007 4.5h19.001c.5522847 0 1 .4477153 1 1v18c0 .5522847-.4477153 1-1 1h-25c-.55228475 0-1-.4477153-1-1v-18c0-.5522847.44771525-1 1-1h3.999l.0007-4.5c0-4.60893412 3.66858369-8.36131661 8.2448469-8.49624327zm11.5003 15h-23v16h23z" fill={fill} fillRule="evenodd" transform="translate(4 2)"/>
      </svg>
    </div>
  )
}

UnlockIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

UnlockIcon.defaultProps = {
  className: 'icon-unlock',
  fill: 'var(--theme-icon-color)',
  height: '18',
  width: '18'
}

export default UnlockIcon
