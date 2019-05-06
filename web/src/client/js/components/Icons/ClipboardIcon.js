import React from 'react'
import PropTypes from 'prop-types'

function ClipboardIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <g fill={fill} transform="translate(7 2)">
          <path d="m19.4265701 30.2840471h-16.65158367c-.91549613 0-1.6692172-.7791624-1.6692172-1.7260639v-22.94620505c0-.95327583.74739978-1.72606386 1.6692172-1.72606386h16.65158367c.9154962 0 1.6692172.77916234 1.6692172 1.72606386v22.94620505c0 .9532758-.7473997 1.7260639-1.6692172 1.7260639zm0 2.2857142c2.1434216 0 3.8807557-1.7963491 3.8807557-4.0117781v-22.94620505c0-2.20916082-1.7437581-4.01177815-3.8807557-4.01177815h-16.65158367c-2.1434216 0-3.88075566 1.79634918-3.88075566 4.01177815v22.94620505c0 2.2091608 1.74375813 4.0117781 3.88075566 4.0117781z"/>
          <path d="m-1.76923077 4.31596639h4.99547511c.61069949 0 1.10576923-.51167458 1.10576923-1.14285715s-.49506974-1.14285714-1.10576923-1.14285714h-4.99547511c-.61069948 0-1.10576923.51167457-1.10576923 1.14285714s.49506975 1.14285715 1.10576923 1.14285715z" transform="matrix(0 1 -1 0 12.748 2.444)"/>
          <path d="m1.76923077 4.31596639h4.99547511c.61069949 0 1.10576923-.51167458 1.10576923-1.14285715s-.49506974-1.14285714-1.10576923-1.14285714h-4.99547511c-.61069948 0-1.10576923.51167457-1.10576923 1.14285714s.49506975 1.14285715 1.10576923 1.14285715z" transform="matrix(0 1 -1 0 16.286 -1.094)"/>
          <path d="m14.4140271 11.1731092h-9.99095018c-.61069948 0-1.10576923.5116746-1.10576923 1.1428572s.49506975 1.1428571 1.10576923 1.1428571h9.99095018c.6106995 0 1.1057693-.5116745 1.1057693-1.1428571s-.4950698-1.1428572-1.1057693-1.1428572zm3.2782806 4.5714286h-13.26923078c-.61069948 0-1.10576923.5116746-1.10576923 1.1428572 0 .6311825.49506975 1.1428571 1.10576923 1.1428571h13.26923078c.6106995 0 1.1057692-.5116746 1.1057692-1.1428571 0-.6311826-.4950697-1.1428572-1.1057692-1.1428572zm-6.1923077 4.5714286h-7.07692308c-.61069948 0-1.10576923.5116746-1.10576923 1.1428571 0 .6311826.49506975 1.1428572 1.10576923 1.1428572h7.07692308c.6106995 0 1.1057692-.5116746 1.1057692-1.1428572 0-.6311825-.4950697-1.1428571-1.1057692-1.1428571z"/>
        </g>
      </svg>
    </div>
  )
}

ClipboardIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

ClipboardIcon.defaultProps = {
  className: 'icon-clipboard',
  fill: '#3b3d3e',
  height: '18',
  width: '18'
}

export default ClipboardIcon
