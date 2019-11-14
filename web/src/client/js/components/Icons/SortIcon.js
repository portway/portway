import React from 'react'
import PropTypes from 'prop-types'

function SortIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m16 12.0909091c.5128358 0 .9355072.3860402.9932723.8833789l.0067277.1166211v14.5454545c0 .5522848-.4477153 1-1 1-.5128358 0-.9355072-.3860402-.9932723-.8833788l-.0067277-.1166212v-14.5454545c0-.5522848.4477153-1 1-1zm5.8181818 6.7878788h9.6969697c.5522848 0 1 .4477152 1 1 0 .5128358-.3860402.9355071-.8833789.9932722l-.1166211.0067278-3.8491515-.0007879.0006667 6.7583636c0 .5128359-.3860402.9355072-.8833789.9932723l-.1166211.0067277c-.5128359 0-.9355072-.3860402-.9932723-.8833788l-.0067277-.1166212-.0006667-6.7583636-3.8478182.0007879c-.5128358 0-.9355071-.3860402-.9932723-.8833789l-.0067277-.1166211c0-.5128359.3860402-.9355072.8833789-.9932723l.1166211-.0067277h9.6969697zm-21.33333331-3.8787879h9.69696971c.5522847 0 1 .4477153 1 1 0 .5128358-.3860402.9355072-.8833789.9932723l-.1166211.0067277h-3.8488182l.00033333 10.6363636c0 .5128359-.38604019.9355072-.88337887.9932723l-.11662113.0067277c-.51283584 0-.93550716-.3860402-.99327227-.8833788l-.00672773-.1166212-.00033333-10.6363636h-3.84815151c-.51283584 0-.93550717-.3860402-.99327227-.8833789l-.00672774-.1166211c0-.5128358.38604019-.9355072.88337888-.9932723l.11662113-.0067277h9.69696971zm26.18181821-15.51515152c.5128358 0 .9355071.38604019.9932722.88337888l.0067278.11662113v14.54545451c0 .5522848-.4477153 1-1 1-.5128359 0-.9355072-.3860402-.9932723-.8833788l-.0067277-.1166212v-14.54545451c0-.55228475.4477152-1.00000001 1-1.00000001zm-21.33333337 0c.51283584 0 .93550716.38604019.99327227.88337888l.00672773.11662113v10.66666671c0 .5522847-.44771525 1-1 1-.51283584 0-.93550716-.3860402-.99327227-.8833789l-.00672773-.1166211v-10.66666671c0-.55228475.44771525-1.00000001 1-1.00000001zm10.55004557.00672774.1166211-.00672774c.5128358 0 .9355072.38604019.9932723.88337888l.0067277.11662113v6.75715151l3.8484848.00042424c.5128359 0 .9355072.38604019.9932723.88337888l.0067277.11662112c0 .51283584-.3860401.93550716-.8833788.99327227l-.1166212.00672773h-9.6969696c-.5522848 0-1-.44771525-1-1 0-.51283584.3860401-.93550716.8833788-.99327227l.1166212-.00672773 3.8484848-.00042424v-6.75715151c0-.51283584.3860402-.93550717.8833789-.99327227l.1166211-.00672774z" fill={fill} fillRule="evenodd" transform="translate(2 4)"/>
      </svg>
    </div>
  )
}

SortIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

SortIcon.defaultProps = {
  className: 'icon-sort',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default SortIcon
