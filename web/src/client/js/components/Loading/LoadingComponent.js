import React from 'react'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

import './_Loading.scss'

function LoadingComponent(props) {
  const overlayDark = getComputedStyle(document.documentElement).getPropertyValue('--theme-overlay-dark')
  return (
    <div className="loading">
      <SpinnerComponent width="48" height="48" color={overlayDark} />
    </div>
  )
}

export default LoadingComponent
