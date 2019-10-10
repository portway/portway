import React, { Suspense, lazy } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Helmet } from 'react-helmet'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import store from './reducers'
import { PATH_APP, PATH_ADMIN, PATH_PROJECTS, PATH_PROJECT, PATH_SETTINGS, PRODUCT_NAME } from 'Shared/constants'
import useDetectInputMode from 'Hooks/useDetectInputMode'
import registerServiceWorker from './utilities/registerServiceWorker'

import AppContainer from 'Components/App/AppContainer'
import HeaderContainer from 'Components/Header/HeaderContainer'
import ErrorBoundaryComponent from 'Components/ErrorBoundary/ErrorBoundaryComponent'

import ConfirmationContainer from 'Components/Confirmation/ConfirmationContainer'
import NotificationsContainer from 'Components/Notifications/NotificationsContainer'

const ProjectsSection = lazy(() => import(/* webpackChunkName: 'ProjectsSection' */ 'Sections/Projects/ProjectsSection'))
const AdminSection = lazy(() => import(/* webpackChunkName: 'AdminSection' */ 'Sections/Admin/AdminSection'))
const UserSection = lazy(() => import(/* webpackChunkName: 'UserSection' */ 'Sections/User/UserSection'))
const ProjectSection = lazy(() => import(/* webpackChunkName: 'ProjectSection' */ 'Sections/Project/ProjectSection'))

import 'CSS/app.scss'

const Index = () => {
  useDetectInputMode()
  return (
    <Provider store={store}>
      <Router basename={PATH_APP}>
        <AppContainer>
          <Helmet>
            <title>{PRODUCT_NAME}</title>
          </Helmet>
          <ErrorBoundaryComponent>
            <ConfirmationContainer />
            <NotificationsContainer />
            <HeaderContainer />
            <Suspense fallback={null}>
              <Route exact path={PATH_PROJECTS} component={props => <ProjectsSection {...props} />} />
              <Route path={`${PATH_PROJECT}/:projectId`} component={props => <ProjectSection {...props} />} />
              <Route path={PATH_SETTINGS} component={props => <UserSection {...props} />} />
              <Route path={PATH_ADMIN} component={props => <AdminSection {...props} />} />
            </Suspense>
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
