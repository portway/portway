import Loadable from 'react-loadable'
import LoadingComponent from 'Components/Loading/LoadingComponent'

function AsyncComponent(options) {
  return Loadable(
    Object.assign(
      {
        loading: LoadingComponent,
        delay: 200,
        timeout: 10000
      },
      options
    )
  )
}

export default AsyncComponent
