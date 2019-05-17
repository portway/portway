import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import store from './reducers'
import Constants from 'Shared/constants'
import useDetectInputMode from 'Hooks/useDetectInputMode'
import registerServiceWorker from './utilities/registerServiceWorker'

import AppContainer from 'Components/App/AppContainer'
import ErrorBoundaryComponent from 'Components/ErrorBoundary/ErrorBoundaryComponent'
import ConfirmationContainer from 'Components/Confirmation/ConfirmationContainer'
import NotificationsContainer from 'Components/Notifications/NotificationsContainer'
import HeaderContainer from 'Components/Header/HeaderContainer'
import DashboardSection from 'Sections/Dashboard/DashboardSection'
import ProjectsSection from 'Sections/Projects/ProjectsSection'
import ProjectSection from 'Sections/Project/ProjectSection'

const Index = () => {
  useDetectInputMode()
  return (
    <Provider store={store}>
      <Router basename={Constants.PATH_APP}>
        <AppContainer>
          <ErrorBoundaryComponent>
            <ConfirmationContainer />
            <HeaderContainer />
            <NotificationsContainer />
            <Route exact path={Constants.PATH_DASHBOARD} component={DashboardSection} />
            <Route exact path={Constants.PATH_PROJECTS} component={ProjectsSection} />
            <Route path={`${Constants.PATH_PROJECT}/:projectId`} component={ProjectSection} />
          </ErrorBoundaryComponent>
        </AppContainer>
      </Router>
    </Provider>
  )
}

render(<Index />, document.getElementById('application'))

registerServiceWorker()

// Todo: Investigate why the globals.js doesnt work for this one
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept()
}
