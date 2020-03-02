import React from 'react'
import PropTypes from 'prop-types'

function NumberIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width={width} height={height}>
        <path d="m26.8329 11.2546357c1.133-.337 2.587-.349 3.718.021.572.187 1.066.456 1.466.802.402.347.723.766.952 1.246.231.483.348 1.023.348 1.604 0 .917-.271 1.702-.804 2.333-.373.443-.847.771-1.415.98 1.616.574 2.434 1.746 2.434 3.495 0 .635-.123 1.221-.367 1.74-.243.521-.59.974-1.033 1.347-.439.372-.974.664-1.59.867-.604.203-1.289.307-2.034.307-.679 0-1.307-.097-1.87-.286-.57-.194-1.064-.461-1.47-.798-.412-.343-.737-.76-.965-1.239-.23-.482-.347-1.022-.347-1.605 0-1.581.881-1.913 1.619-1.913.444 0 .804.134 1.066.397.264.262.398.621.398 1.066 0 .423-.146.77-.434 1.035-.215.196-.481.318-.796.366.293.955 1.135 1.421 2.565 1.421.893 0 1.566-.207 1.999-.616.429-.406.645-1.023.645-1.834 0-.941-.284-1.662-.869-2.203-.583-.541-1.404-.815-2.441-.815h-.25v-1.439h.25c.491 0 .944-.07 1.346-.21.396-.137.739-.335 1.02-.587.283-.253.497-.549.653-.902.155-.352.233-.749.233-1.181 0-.688-.194-1.197-.592-1.556-.4-.359-1-.542-1.78-.542-1.397 0-2.218.401-2.5 1.223.319.044.587.159.798.344.283.254.426.609.426 1.059 0 .448-.141.809-.42 1.072-.276.259-.64.391-1.082.391-.532 0-.956-.185-1.259-.55-.291-.352-.439-.836-.439-1.441 0-.548.118-1.054.351-1.503.232-.45.561-.84.979-1.161.418-.318.919-.566 1.491-.735zm-19.9489-.2356v13.149l2.095.371v1.262h-6.979v-1.268l2.486-.37v-10.747h-2.486v-1.497h.25c.22 0 .476-.018.782-.056.289-.037.581-.094.867-.17.281-.076.538-.166.761-.27.204-.092.356-.198.451-.313l.075-.091zm7.3034.2558c1.142-.366 2.659-.366 3.784.001.571.186 1.067.459 1.475.812.409.354.732.788.956 1.291.221.499.333 1.059.333 1.667 0 .84-.2 1.595-.594 2.242-.378.627-.865 1.2-1.448 1.704-.564.486-1.185.935-1.844 1.335-.637.385-1.243.767-1.799 1.138-.546.362-1.002.735-1.357 1.108-.26.273-.414.56-.468.87h5.684l.471-2.505h1.532v4.864h-9.794v-1.543c0-.722.19-1.395.567-2 .363-.585.821-1.141 1.361-1.653.544-.516 1.131-1.013 1.744-1.475.61-.463 1.183-.942 1.701-1.422.513-.475.944-.98 1.281-1.499.325-.497.489-1.053.489-1.655 0-.655-.206-1.137-.631-1.476-.436-.347-1.087-.523-1.937-.523-1.332 0-2.139.465-2.458 1.419.332.045.604.166.81.361.273.256.412.614.412 1.061s-.139.805-.412 1.063c-.271.254-.644.381-1.112.381-.711 0-1.56-.325-1.56-1.875 0-.594.116-1.144.346-1.632.232-.488.56-.911.976-1.258.411-.344.913-.613 1.492-.801z" fill={fill} fillRule="evenodd"/>
      </svg>
    </div>
  )
}

NumberIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

NumberIcon.defaultProps = {
  className: 'icon-number',
  fill: 'var(--theme-icon-color)',
  height: '18',
  width: '18'
}

export default NumberIcon
