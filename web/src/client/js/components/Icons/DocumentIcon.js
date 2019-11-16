import React from 'react'
import PropTypes from 'prop-types'

function DocumentIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36" className={className}>
        <path d="m16.9998 0c.0425909 0 .0845598.00266262.1257495.00783047l-.1257495-.00783047c.0528361 0 .1052411.00418141.1567725.01236099.0316208.00484261.0625339.01125483.0928895.01905644.0101433.00286227.0202282.00563245.0302632.00855877.0310147.00875604.0614255.01924997.0911333.03112776.0089606.00386561.0179982.00763024.0269792.01152693.0282618.01200726.0556236.02543702.0822482.04004347.0103694.00588387.0209728.01193895.0314683.01819032.0281524.01663291.0552727.03468478.0814196.05397984.0064079.00479039.0132865.00998986.0201024.01528215.004452.00341221.0083241.00647321.0121728.0095621l.0816578.07320445 10 9.99999998c.0293377.0293377.056861.0604899.0823871.0932737l-.0823871-.0932737c.0358441.0358441.0686861.0741292.0983641.1144644.0189796.0256155.0370315.0527358.0537529.0807423.0061629.0106414.012218.0212448.0180744.0319504.0146339.0262884.0280636.0536502.0402467.0816791.0037209.0092139.0074855.0182515.0111169.0273429.012112.029577.022606.0599878.0316363.0910217.002652.0100158.0054222.0201007.0080347.0302319.0080514.0303677.0144636.0612808.0194146.0926794.0015392.0106019.0030246.0210172.0043462.0314642.0052438.0409707.0079064.0829396.0079064.1255305v22c0 .5522847-.4477153 1-1 1h-26c-.55228475 0-1-.4477153-1-1v-32c0-.55228475.44771525-1 1-1zm-1 2h-14v30h24l-.001-20h-8.999c-.5128358 0-.9355072-.3860402-.9932723-.8833789l-.0067277-.1166211zm6 22c.5522847 0 1 .4477153 1 1 0 .5128358-.3860402.9355072-.8833789.9932723l-.1166211.0067277h-16c-.55228475 0-1-.4477153-1-1 0-.5128358.38604019-.9355072.88337887-.9932723l.11662113-.0067277zm0-7c.5522847 0 1 .4477153 1 1 0 .5128358-.3860402.9355072-.8833789.9932723l-.1166211.0067277h-16c-.55228475 0-1-.4477153-1-1 0-.5128358.38604019-.9355072.88337887-.9932723l.11662113-.0067277zm-10-7c.5522847 0 1 .4477153 1 1 0 .5128358-.3860402.9355072-.8833789.9932723l-.1166211.0067277h-6c-.55228475 0-1-.4477153-1-1 0-.5128358.38604019-.9355072.88337887-.9932723l.11662113-.0067277zm12.585 0-6.585-6.585v6.585z" fill={fill} fillRule="evenodd" transform="translate(4 1)"/>
      </svg>
    </div>
  )
}

DocumentIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

DocumentIcon.defaultProps = {
  className: 'icon-document',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F2F2F2' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default DocumentIcon
