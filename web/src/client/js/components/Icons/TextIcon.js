import React from 'react'
import PropTypes from 'prop-types'

function TextIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m23.149.5c1.130263 0 2.1465991.4866013 2.851 1.26179555.6574409-.72351464 1.5866119-1.19563274 2.6265251-1.2553662l.2244749-.00642935h3.149c.5522847 0 1 .44771525 1 1 0 .51283584-.3860402.93550716-.8833789.99327227l-.1166211.00672773h-3.149c-.9740145 0-1.7716749.75127868-1.8454339 1.70628892l-.0055661.14471108v26.298c0 .9740145.7512787 1.7716749 1.7062889 1.8454339l.1447111.0055661h3.149c.5522847 0 1 .4477153 1 1 0 .5128358-.3860402.9355072-.8833789.9932723l-.1166211.0067277h-3.149c-1.130263 0-2.1465991-.4866013-2.851-1.2617955-.6574409.7235146-1.5866119 1.1956327-2.6265251 1.2553662l-.2244749.0064293h-3.149c-.5522847 0-1-.4477153-1-1 0-.5128358.3860402-.9355072.8833789-.9932723l.1166211-.0067277h3.149c.9740145 0 1.7716749-.7512787 1.8454339-1.7062889l.0055661-.1447111v-26.298c0-.97401452-.7512787-1.77167485-1.7062889-1.84543385l-.1447111-.00556615h-3.149c-.5522847 0-1-.44771525-1-1 0-.51283584.3860402-.93550716.8833789-.99327227l.1166211-.00672773zm-5.149 6.1274v6.342h-1.57l-.966-4.53h-4.953v17.91l3.201.724v1.299h-9.423v-1.299l3.201-.724v-17.91h-4.983l-.936 4.53h-1.571v-6.342z" fill={fill} fillRule="evenodd" transform="translate(2 1)"/>
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
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F2F2F2' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default TextIcon
