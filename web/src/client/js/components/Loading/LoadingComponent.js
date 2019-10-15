import React from 'react'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

import './_Loading.scss'

function LoadingComponent(props) {
  return (
    <div className="loading">
      <SpinnerComponent width="48" height="48" />
      <p>Loading...</p>
    </div>
  )
}

export default LoadingComponent
