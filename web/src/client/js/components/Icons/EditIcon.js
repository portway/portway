import React from 'react'
import PropTypes from 'prop-types'

function EditIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m20.5243932 1.96829322c2.6245243-2.62452429 6.8816893-2.62452429 9.5062136 0 2.6255506 2.62555066 2.6255506 6.88283767.0001504 9.50706308l.0209479-.0204479c-.0067088.007108-.0135416.0141417-.0204983.0210984l-.0173738.0148932-2.3336262 2.3356068-16.532 16.532c-.1529897.1529897-.3514715.2522342-.5656561.2828385l-9.44099998 1.349c-.65993907.094297-1.22563149-.4713283-1.13141279-1.1312786l1.348-9.442c.03058461-.2142284.12983692-.4127551.28285529-.5657735zm-17.96356017 25.17060678-.38233822 2.6829654 2.68233822-.3839654zm16.31926697-20.69828644-15.58915601 15.58915604-.37611096 2.6341304 4.42 4.42 2.6348508-.3752974 15.58920257-15.5892026zm2.350733-2.35071356-.937.936 6.679 6.679.936-.937zm7.3855602-.70739322c-1.6008212-1.60082123-4.06683-1.81153539-5.8954185-.63214248l6.5279985 6.5284097c1.1799122-1.82857242.9690867-4.29460051-.63258-5.89626722z" fill={fill} fillRule="evenodd" transform="translate(2 2)"/>
      </svg>
    </div>
  )
}

EditIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

EditIcon.defaultProps = {
  className: 'icon-edit',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default EditIcon
