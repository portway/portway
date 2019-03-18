import React from 'react'

function LoadingComponent(props) {
  if (props.error) {
    // When the loader has errored
    return (
      <div>
        Error! <button onClick={props.retry}>Retry</button>
      </div>
    )
  } else if (props.timedOut) {
    // When the loader has taken longer than the timeout
    return (
      <div>
        Taking a long time... <button onClick={props.retry}>Retry</button>
      </div>
    )
  } else if (props.pastDelay) {
    // When the loader has taken longer than the delay
    return <div>Loading...</div>
  } else {
    // When the loader has just started
    return null
  }
}

export default LoadingComponent
