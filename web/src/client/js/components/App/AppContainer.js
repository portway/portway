import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { routeChange } from 'Actions/route'
import { createNotification } from 'Actions/notifications'
import { updateNetworkStatus } from 'Actions/application'


import App from './App'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = { createNotification, routeChange, updateNetworkStatus }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(App)
)
