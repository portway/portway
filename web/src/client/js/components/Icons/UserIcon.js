import React from 'react'
import PropTypes from 'prop-types'

function UserIcon({ className, fill, height, width }) {
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
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 37 37">
        <g style={style} transform="translate(2 2)">
          <path d="m16.0001939 5.33333333c3.2126061 0 5.8181819 2.60460606 5.8181819 5.81818187 0 3.212606-2.6055758 5.8181818-5.8181819 5.8181818-3.212606 0-5.8181818-2.6055758-5.8181818-5.8181818 0-3.21357581 2.6055758-5.81818187 5.8181818-5.81818187zm0 15.51515147c4.6303031 0 8.6671516 2.5047273 10.857697 6.2244849 2.8712727-2.8150303 4.6574546-6.7335758 4.6574546-11.0729697 0-8.56824242-6.9469091-15.51515151-15.5151516-15.51515151-8.56921208 0-15.51515148 6.94690909-15.51515148 15.51515151 0 4.3393939 1.78618182 8.2579394 4.65648485 11.0729697 2.19151515-3.7197576 6.22836363-6.2244849 10.85866663-6.2244849z"/>
          <path d="m26.8581818 27.0733576c-2.1915151-3.7207273-6.2273939-6.2244849-10.857697-6.2244849-4.6312727 0-8.66715147 2.5037576-10.85963632 6.2244849 2.79951516 2.7442424 6.62884852 4.4421818 10.85963632 4.4421818 4.2288485 0 8.0591516-1.6979394 10.857697-4.4421818z"/>
        </g>
      </svg>
    </div>
  )
}

UserIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

UserIcon.defaultProps = {
  className: 'icon-user',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default UserIcon
