import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { routeChange } from 'Actions/route'
import App from './App'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = { routeChange }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(App)
)
