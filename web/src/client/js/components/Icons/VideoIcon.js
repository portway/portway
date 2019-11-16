import React from 'react'
import PropTypes from 'prop-types'

function VideoIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m36.5135135.48677838c.5522848 0 1 .44771525 1 1v23.35144862c0 .473387-.3289336.8699473-.7707092.9735893l-.1126697.0195857-.1166211.006825-35.02702701-.0000973-.11662113-.0067277-.1126697-.0195857c-.44177552-.103642-.77070917-.5002023-.77070917-.9735893v-23.35144862c0-.55228475.44771525-1 1-1zm-30.19002701 19.51300002h-3.838l.001 3.8383513 3.837-.0003513zm23.35200001-17.51300002h-21.35200001v21.35100002h21.35200001zm5.838 17.51300002h-3.838v3.838l3.838027.0003513zm-19.9151172-12.08766745 7.7837838 4.37837835c.6796517.3823041.6796517 1.360847 0 1.7431511l-7.7837838 4.3783784c-.666604.3749648-1.4902612-.1067491-1.4902612-.8715756v-8.75675671c0-.76482648.8236572-1.24654032 1.4902612-.87157554zm19.9151172 6.24966745h-3.838v3.838h3.838zm-29.19000001 0h-3.838v3.838h3.838zm9.78462161-3.6682444v5.3370618l4.7440549-2.6685309zm19.4053784-2.16975562h-3.838v3.83800002h3.838zm-29.19000001 0h-3.838v3.83800002h3.838zm29.19002701-5.837h-3.838027v3.837h3.838zm-29.19002701 0h-3.837l-.001 3.837h3.838z" fill={fill} fillRule="evenodd" transform="translate(-1 5)"/>
      </svg>
    </div>
  )
}

VideoIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

VideoIcon.defaultProps = {
  className: 'icon-video',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F2F2F2' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default VideoIcon
