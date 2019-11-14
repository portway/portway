import React from 'react'
import PropTypes from 'prop-types'

function FilterIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m11.0740741 20.6666667h3.8518518c.5522848 0 1 .4477152 1 1 0 .5128358-.3860402.9355071-.8833788.9932722l-.1166212.0067278h-3.8518518c-.5522848 0-1-.4477153-1-1 0-.5128359.3860402-.9355072.8833788-.9932723l.1166212-.0067277h3.8518518zm-3.85185188-7.0618889h11.55555558c.5522847 0 1 .4477152 1 1 0 .5128358-.3860402.9355071-.8833789.9932722l-.1166211.0067278h-11.55555558c-.55228475 0-1-.4477153-1-1 0-.5128359.38604019-.9355072.88337888-.9932723l.11662112-.0067277h11.55555558zm-3.85185185-7.06140743h19.25925923c.5522848 0 1 .44771525 1 1 0 .51283584-.3860402.93550716-.8833788.99327227l-.1166212.00672773h-19.25925923c-.55228475 0-1-.44771525-1-1 0-.51283584.38604019-.93550716.88337887-.99327227l.11662113-.00672773h19.25925923zm-2.88888889-7.06188889h25.03703702c.5522848 0 1 .44771525 1 1 0 .51283584-.3860402.93550716-.8833789.99327227l-.1166211.00672773h-25.03703702c-.55228475 0-1-.44771525-1-1 0-.51283584.38604019-.93550716.88337888-.99327227l.11662112-.00672773h25.03703702z" fill={fill} fillRule="evenodd" transform="translate(5 7)"/>
      </svg>
    </div>
  )
}

FilterIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

FilterIcon.defaultProps = {
  className: 'icon-filter',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F2F2F2' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default FilterIcon
