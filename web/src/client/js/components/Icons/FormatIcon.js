import React from 'react'
import PropTypes from 'prop-types'

function FormatIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m15.5070394 27.2162162h3.871339l-7.169664-20.2162162h-4.05302639l-7.15568801 20.2162162h3.64772377l1.73301819-5.2256747h7.42123114zm-5.4184618-15.6216216h.2280529l2.6293154 8.2702703h-5.51351347zm16.9903803 16.5405405c1.9529466 0 3.5917829-.8556011 4.424858-2.3184032h.2321685v2.0700029h3.2640156v-10.3086143c0-3.1878044-2.1578011-5.064607-5.9954094-5.064607-3.550812 0-6.0227234 1.6836023-6.2958628 4.319406h3.1957308c.3141103-1.0350014 1.3793539-1.6008022 2.9362483-1.6008022 1.8300339 0 2.8133357.8418011 2.8133357 2.3460032v1.2972018l-3.8512653.2346003c-3.6327538.2070003-5.6676422 1.7940025-5.6676422 4.4988063 0 2.7600038 2.0622024 4.5264062 4.9438228 4.5264062zm.5085653-2.7567567c-1.5688859 0-2.6956313-.7971694-2.6956313-2.1596044 0-1.318953.927069-2.0581465 2.9095703-2.1885924l3.5228621-.2463978v1.289965c0 1.8842186-1.5974111 3.3046296-3.7368011 3.3046296z" fill={fill} fillRule="evenodd"/>
      </svg>
    </div>
  )
}

FormatIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

FormatIcon.defaultProps = {
  className: 'icon-format',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F2F2F2' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default FormatIcon
