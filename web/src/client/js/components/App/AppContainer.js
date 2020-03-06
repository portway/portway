import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { routeChange } from 'Actions/route'
import { createNotification } from 'Actions/notifications'

import App from './App'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = { createNotification, routeChange }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(App)
)
