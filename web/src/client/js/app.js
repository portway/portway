import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import store from './reducers'
import registerServiceWorker from './utilities/registerServiceWorker'

import Constants from 'Shared/constants'
import useDetectInputMode from 'Hooks/useDetectInputMode'

import ErrorBoundaryComponent from 'Components/ErrorBoundary/ErrorBoundaryComponent'
import ConfirmationContainer from 'Components/Confirmation/ConfirmationContainer'
import HeaderContainer from 'Components/Header/HeaderContainer'
import DashboardSection from 'Sections/Dashboard/DashboardSection'
import ProjectsSection from 'Sections/Projects/ProjectsSection'
import ProjectSection from 'Sections/Project/ProjectSection'

import 'CSS/app.scss'

const App = () => {
  useDetectInputMode()
  return (
    <Provider store={store}>
      <Router basename={Constants.PATH_APP}>
        <ErrorBoundaryComponent>
          <ConfirmationContainer />
          <HeaderContainer />
          <Route exact path={Constants.PATH_DASHBOARD} component={DashboardSection} />
          <Route exact path={Constants.PATH_PROJECTS} component={ProjectsSection} />
          <Route path={`${Constants.PATH_PROJECT}/:projectId`} component={ProjectSection} />
        </ErrorBoundaryComponent>
      </Router>
    </Provider>
  )
}

render(<App />, document.getElementById('application'))

registerServiceWorker()

// Todo: Investigate why the globals.js doesnt work for this one
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept()
}
