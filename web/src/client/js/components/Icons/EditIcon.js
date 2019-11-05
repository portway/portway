import React from 'react'
import PropTypes from 'prop-types'

function EditIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  const style = {
    stroke: fill,
    strokeWidth: 2,
    fill: 'none',
    fillRule: 'evenodd',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <g style={style} transform="translate(3 3)">
          <path d="m17.8805 4.0264 2.351-2.351c2.234-2.234 5.858-2.234 8.092 0 2.235 2.235 2.235 5.859 0 8.093l-2.35 2.351"/>
          <path d="m9.4411 28.6514-9.441 1.349 1.348-9.442 16.532-16.532 8.093 8.093z"/>
          <path d="m5.9821 29.1456-5.128-5.127m19.377-22.3427 8.093 8.093"/>
        </g>
      </svg>
    </div>
  )
}

EditIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

EditIcon.defaultProps = {
  className: 'icon-edit',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default EditIcon
