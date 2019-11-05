import React from 'react'
import PropTypes from 'prop-types'

function TextIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <g fill="none" fillRule="evenodd" transform="translate(2 2)">
          <path d="m0 5.6274v6.342h1.571l.936-4.53h4.983v17.91l-3.201.724v1.299h9.423v-1.299l-3.201-.724v-17.91h4.953l.966 4.53h1.57v-6.342z" fill={fill}/>
          <g stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="translate(20)">
            <path d="m12 .5h-3-.149c-1.575 0-2.851 1.276-2.851 2.851v2.85-2.85c0-1.575-1.276-2.851-2.851-2.851h-.149-3"/>
            <path d="m6 6.2012v20.598"/>
            <path d="m0 32.5h3 .149c1.575 0 2.851-1.276 2.851-2.851v-2.85 2.85c0 1.575 1.276 2.851 2.851 2.851h.149 3"/>
          </g>
        </g>
      </svg>
    </div>
  )
}

TextIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

TextIcon.defaultProps = {
  className: 'icon-text',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default TextIcon
