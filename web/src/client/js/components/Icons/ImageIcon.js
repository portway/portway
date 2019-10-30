import React from 'react'
import PropTypes from 'prop-types'

function ImageIcon({ className, fill, height, width }) {
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
        <g style={style} transform="translate(2 2)">
          <path d="m.48484849 31.5151515h31.03030301v-31.03030301h-31.03030301z"/>
          <path d="m14.0606061 10.1818182c0 2.1420606-1.7367273 3.8787879-3.8787879 3.8787879-2.14206062 0-3.8787879-1.7367273-3.8787879-3.8787879 0-2.14206062 1.73672728-3.8787879 3.8787879-3.8787879 2.1420606 0 3.8787879 1.73672728 3.8787879 3.8787879z"/>
          <path d="m.48484849 31.5151515 21.33333331-18.4242424 9.6969697 7.7575757"/>
        </g>
      </svg>
    </div>
  )
}

ImageIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

ImageIcon.defaultProps = {
  className: 'icon-image',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default ImageIcon
