import React from 'react'
import PropTypes from 'prop-types'

function OrganizationIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width={width} height={height}>
        <path d="m17.0003-.0002c9.3889491 0 17 7.61137954 17 17 0 9.3886205-7.6110509 17-17 17-9.38894905 0-17-7.6113795-17-17 0-9.38862046 7.61105095-17 17-17zm0 2c-8.28436022 0-15 6.71592971-15 15 0 8.2840703 6.71563978 15 15 15 8.2843602 0 15-6.7159297 15-15 0-8.28407029-6.7156398-15-15-15zm-9.0003 25.0002c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1l1.0003-.0002v-16c-.51313584.0002-.93580716-.38584019-.99357227-.88317887l-.00672773-.11662113c0-.55228475.44771525-1 1-1h16c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1l.0003-.0002v16l.9997.0002c.5128358 0 .9355072.3860402.9932723.8833789l.0067277.1166211c0 .5522847-.4477153 1-1 1zm15.0003-18.0002h-12l.001 16h2.499l.0007-4.9998c0-.5522847.4477153-1 1-1h5c.5522847 0 1 .4477153 1 1l-.0007 4.9998h2.501zm-4.4993 12.0002h-3v4h3zm-.5-6v2h-2v-2zm-3 0v2h-2v-2zm6 0v2h-2v-2zm-3-4v2h-2v-2zm-3 0v2h-2v-2zm6 0v2h-2v-2z" fill={fill} fillRule="evenodd" transform="translate(1 1)"/>
      </svg>
    </div>
  )
}

OrganizationIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

OrganizationIcon.defaultProps = {
  className: 'icon-organization',
  fill: 'var(--theme-icon-color)',
  height: '18',
  width: '18'
}

export default OrganizationIcon
