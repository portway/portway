import React from 'react'
import PropTypes from 'prop-types'

function TrashIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <g fill="#3b3d3e" transform="translate(4 3)">
          <path d="m3 3h22c1.1045695 0 2 .8954305 2 2v22c0 2.209139-1.790861 4-4 4h-18c-2.209139 0-4-1.790861-4-4v-22c0-1.1045695.8954305-2 2-2zm.5 2.5v21.5c0 .8284271.67157288 1.5 1.5 1.5h18c.8284271 0 1.5-.6715729 1.5-1.5v-21.5z"/>
          <path d="m19 9.53482966v15.00000004c0 .5522847.4477153 1 1 1s1-.4477153 1-1v-15.00000004c0-.55228475-.4477153-1-1-1s-1 .44771525-1 1zm-6 0v15.00000004c0 .5522847.4477153 1 1 1s1-.4477153 1-1v-15.00000004c0-.55228475-.4477153-1-1-1s-1 .44771525-1 1zm-6 0v15.00000004c0 .5522847.44771525 1 1 1s1-.4477153 1-1v-15.00000004c0-.55228475-.44771525-1-1-1s-1 .44771525-1 1zm-7-4.40982966h28c.6213203 0 1.125-.50367966 1.125-1.125s-.5036797-1.125-1.125-1.125h-28c-.62132034 0-1.125.50367966-1.125 1.125s.50367966 1.125 1.125 1.125z"/>
          <path d="m7.125 3v-1c0-.48324916.39175084-.875.875-.875h12c.4832492 0 .875.39175084.875.875v1c0 .62132034.5036797 1.125 1.125 1.125s1.125-.50367966 1.125-1.125v-1c0-1.72588984-1.3991102-3.125-3.125-3.125h-12c-1.72588984 0-3.125 1.39911016-3.125 3.125v1c0 .62132034.50367966 1.125 1.125 1.125s1.125-.50367966 1.125-1.125z"/>
        </g>
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
  fill: '#3b3d3e',
  height: '18',
  width: '18'
}

export default TrashIcon
