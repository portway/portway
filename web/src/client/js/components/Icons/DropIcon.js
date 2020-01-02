import React from 'react'
import PropTypes from 'prop-types'

function DropIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m9.3767 3.8786c.55228475 0 1 .44771525 1 1s-.44771525 1-1 1h-7.376v25.151h29.03v-25.151h-7.378c-.5522847 0-1-.44771525-1-1s.4477153-1 1-1h8.378c.5522847 0 1 .44771525 1 1v27.151c0 .5522847-.4477153 1-1 1h-31.03c-.55228475 0-1-.4477153-1-1v-27.151c0-.55228475.44771525-1 1-1zm7.1383-3.8785c.5128358 0 .9355072.38604019.9932723.88337888l.0067277.11662112v21.3419l7.0204932-7.0192068c.360484-.3604839.927715-.3882135 1.3200062-.0831886l.0942074.0831886c.3604839.360484.3882135.927715.0831886 1.3200062l-.0831886.0942074-8.728 8.728c-.3604986.3604985-.9277574.3882138-1.3200476.0831565l-.0942065-.083197-8.72699999-8.728c-.39050192-.3905467-.39046564-1.0237117.00008102-1.4142136.36050461-.3604633.92773726-.3881603 1.32001099-.083113l.09420257.083194 7.02025271 7.0211663v-21.3439c0-.47338693.3289337-.86994729.7707092-.97358929l.1126697-.01968298z" fill={fill} fillRule="evenodd" transform="translate(1 2)"/>
      </svg>
    </div>
  )
}

DropIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

DropIcon.defaultProps = {
  className: 'icon-drop',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F2F2F2' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default DropIcon
