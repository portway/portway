import React from 'react'
import PropTypes from 'prop-types'

function FileIcon({ className, extension, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <g fill={fill} fillRule="evenodd" transform="translate(3 1)">
          <path d="m17.9999-.0003c.039798 0 .079053.00232487.1176366.00684621l-.1176366-.00734621c.0593974 0 .11825.00528442.1759293.0155929.0249478.00476177.0495176.01010108.0737327.01632453.0101433.00236227.0202282.00513245.0302632.00805877.0296005.00884453.0586526.0187966.0870676.03001259.0138691.00525917.0276117.01103925.0412204.01712442.0187428.00862053.0371491.01755667.0552298.02702983.0205321.01046092.0408795.02202091.0608223.03429806.017263.01099244.0340351.02205507.0504444.03359868.0113077.00754013.0223929.01567205.0333198.02404085l.0078572.00652871c.02043.01599247.0402222.03276228.0593321.05026494l.031888.03001894 10 9.99999998.036812.0393235c.0141702.0157636.0278466.03198.0410048.0486249l-.0778168-.0879484c.0398586.0398587.076005.0827356.1082166.1280937.0139851.0199689.0279425.0411845.0410942.0629418.0079594.0130002.0153675.0259514.0224786.0390545.0135002.0248882.0261023.0505786.0376073.0768587.0047556.0110255.0093367.0220543.0137192.0331624.0104493.026185.0198033.053139.0280101.0805883.0038792.0134069.0075023.0265115.0108586.0396938.0072989.0281904.0133538.0572923.0181152.0868271.0014722.009508.0028641.0189618.004121.0284425.0012166.0091787.0015876.0122487.0019447.0153229l.0067277.1161211v22c0 .5128358-.3860402.9355072-.8833789.9932723l-.1166211.0067277h-26c-.51283584 0-.93550716-.3860402-.99327227-.8833789l-.00672773-.1166211-.00091139-4.5642005c-.55181985-.0005462-.99898861-.4480519-.99898861-.9999995v-12c0-.5522847.44771525-1 1-1l-.001-.0008.0009-13.435c0-.51283584.38604019-.93550716.88337887-.99327227l.11662113-.00672773zm-1.0009 1.9985-14 .0008v12.4352l20.001.0008c.5128358 0 .9355072.3860402.9932723.8833789l.0067277.1166211v12c0 .5522847-.4477153 1-1 1l-20.001-.0008v3.5648h24v-19.9998l-8.9991.0005c-.5128358 0-.9355072-.3860402-.9932723-.8833789l-.0067277-.1166211zm5.001 14.4358-19.981-.0008-.019.001v10.0008h20zm-3.001-13.0218v6.5868l6.587.0002z"/>
          <text fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif" fontSize="7" fontWeight="600" letterSpacing=".2">
            <tspan x="4.479541" y="24">{extension}</tspan>
          </text>
        </g>
      </svg>
    </div>
  )
}

FileIcon.propTypes = {
  className: PropTypes.string,
  extension: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

FileIcon.defaultProps = {
  className: 'icon-file',
  extension: 'FILE',
  fill: 'var(--theme-icon-color)',
  height: '18',
  width: '18'
}

export default FileIcon
