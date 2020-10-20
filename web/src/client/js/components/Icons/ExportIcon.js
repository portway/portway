import React from 'react'
import PropTypes from 'prop-types'

function ExportIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36" className={className}>
        <path d="m16.0002-1.0003c9.3889491 0 17 7.61137954 17 17 0 9.3886205-7.6110509 17-17 17-9.38894905 0-17-7.6113795-17-17 0-9.38862046 7.61105095-17 17-17zm0 2c-8.28436022 0-15 6.71592971-15 15 0 8.2840703 6.71563978 15 15 15 8.2843602 0 15-6.7159297 15-15 0-8.28407029-6.7156398-15-15-15zm0 3.9998c.5128358 0 .9355072.38604019.9932723.88337887l.0067277.11662113v17.5832l5.6395932-5.6368068c.360484-.3604839.927715-.3882135 1.3200062-.0831886l.0942074.0831886c.3604839.360484.3882135.927715.0831886 1.3200062l-.0831886.0942074-7.347 7.347c-.3605013.3605013-.9277653.3882138-1.3200554.0831505l-.0942063-.0831986-7.346-7.347c-.39049772-.3905509-.39045462-1.0237159.00009625-1.4142136.36050849-.3604594.92774143-.3881504 1.32001188-.0830988l.09420167.083195 5.6391451 5.6387587v-17.5852c0-.55228475.4477153-1 1-1z" fill={fill} transform="translate(2 2)"/>
      </svg>
    </div>
  )
}

ExportIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

ExportIcon.defaultProps = {
  className: 'icon-export',
  fill: 'var(--theme-icon-color)',
  height: '18',
  width: '18'
}

export default ExportIcon
