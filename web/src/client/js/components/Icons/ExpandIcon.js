import React from 'react'
import PropTypes from 'prop-types'

function ExpandIcon({ className, fill, height, width }) {
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
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36" className={className}>
        <g style={style} transform="translate(2 2)">
          <path d="m-.0001 19.3937v11.637h11.637m-11.637-.0002 12-12"/>
          <path d="m31.0301 11.6359v-11.636h-11.636m-.364 12.0003 12-12"/>
        </g>
      </svg>
    </div>
  )
}

ExpandIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

ExpandIcon.defaultProps = {
  className: 'icon-expand',
  fill: '#3b3d3e',
  height: '18',
  width: '18'
}

export default ExpandIcon
