import React from 'react'
import PropTypes from 'prop-types'

function TeamsIcon({ className, fill, height, width }) {
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
          <path d="m7.0794 11.721c1.381 0 2.5 1.119 2.5 2.5s-1.119 2.5-2.5 2.5-2.5-1.119-2.5-2.5 1.119-2.5 2.5-2.5zm16.8701 0c1.381 0 2.5 1.119 2.5 2.5s-1.119 2.5-2.5 2.5c-1.38 0-2.5-1.119-2.5-2.5s1.12-2.5 2.5-2.5zm-8.4346-4.1728c1.933 0 3.5 1.566 3.5 3.5 0 1.933-1.567 3.5-3.5 3.5-1.934 0-3.5-1.567-3.5-3.5 0-1.934 1.566-3.5 3.5-3.5z"/>
          <path d="m28.7581 23.5833c-.212-2.483-2.271-4.439-4.809-4.439-1.272 0-2.42.501-3.287 1.304.427.809.671 1.729.671 2.706v6.752"/>
          <path d="m9.6966 29.9066v-6.751c0-.9.21-1.748.574-2.508-.854-.753-1.964-1.224-3.191-1.224-2.455 0-4.463 1.832-4.783 4.2"/>
          <path d="m20.6624 20.4486c-.974-1.85-2.912-3.112-5.147-3.112-2.314 0-4.307 1.355-5.245 3.311"/>
          <path d="m31.0306 15.515c0 8.568-6.947 15.516-15.516 15.516s-15.514-6.948-15.514-15.516 6.945-15.515 15.514-15.515 15.516 6.947 15.516 15.515z"/>
        </g>
      </svg>
    </div>
  )
}

TeamsIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

TeamsIcon.defaultProps = {
  className: 'icon-teams',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default TeamsIcon
