import React from 'react'
import PropTypes from 'prop-types'

function ArrowIcon({ className, direction, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  // this arrow is up
  let arrowDirection
  switch (direction) {
    case 'up':
      arrowDirection = 'rotate(0deg)'
      break
    case 'down':
      arrowDirection = 'rotate(180deg)'
      break
    case 'left':
      arrowDirection = 'rotate(-90deg)'
      break
    case 'right':
      arrowDirection = 'rotate(90deg)'
      break
    default:
      arrowDirection = 'rotate(0deg)'
  }
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36" style={{ transform: arrowDirection }}>
        <path d="m.7777417 16.2925053 15.5151515-15.51515147c.3905243-.3905243 1.0236893-.3905243 1.4142136 0 .3604839.36048396.3882135.92771501.0831886 1.32000622l-.0831886.09420734-13.8081068 13.80743261 28.6161515.0006121c.5128359 0 .9355072.3860402.9932723.8833789l.0067277.1166211c0 .5128359-.3860402.9355072-.8833789.9932723l-.1166211.0067277-28.6161515-.0006121 13.8081068 13.8086569c.3604839.3604839.3882135.927715.0831886 1.3200062l-.0831886.0942073c-.360484.360484-.927715.3882135-1.3200062.0831886l-.0942074-.0831886-15.5151515-15.5151515-.08003107-.0902596-.06448977-.0924333-.04082994-.072781-.04760425-.109833-.0328278-.1095783-.01620497-.0845094-.01036323-.114684.00307378-.1182524.02341268-.1466375.03291154-.1099211.04976662-.1140791.03561006-.0637343c.01311012-.0213542.0269502-.0422571.04153403-.0625904l.02975829-.0394059c.02379451-.029948.04927009-.0585003.07628403-.0855143l15.5151515-15.51515147z" fill={fill} fillRule="evenodd" transform="translate(1 1)"/>
      </svg>
    </div>
  )
}

ArrowIcon.propTypes = {
  className: PropTypes.string,
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

ArrowIcon.defaultProps = {
  className: 'icon-arrow',
  direction: 'left',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F2F2F2' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default ArrowIcon
