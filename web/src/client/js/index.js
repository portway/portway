import React, { Suspense, lazy } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { Helmet } from 'react-helmet'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import store from './reducers'
import {
  LOCKED_ACCOUNT_STATUSES,
  PATH_APP,
  PATH_ADMIN,
  PATH_PROJECTS,
  PATH_PROJECT,
  PATH_SETTINGS,
  PRODUCT_NAME
} from 'Shared/constants'
import useDetectInputMode from 'Hooks/useDetectInputMode'
import registerServiceWorker from './utilities/registerServiceWorker'
import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import AppContainer from 'Components/App/AppContainer'
import HeaderContainer from 'Components/Header/HeaderContainer'
import ErrorBoundaryComponent from 'Components/ErrorBoundary/ErrorBoundaryComponent'

import ConfirmationContainer from 'Components/Confirmation/ConfirmationContainer'
import NotificationsContainer from 'Components/Notifications/NotificationsContainer'

const LockedViewContainer = lazy(() => import(/* webpackChunkName: 'LockedViewContainer' */ 'Components/LockedView/LockedViewContainer'))
const ProjectsSection = lazy(() => import(/* webpackChunkName: 'ProjectsSection',  webpackPreload: true */ 'Sections/Projects/ProjectsSection'))
const AdminSection = lazy(() => import(/* webpackChunkName: 'AdminSection' */ 'Sections/Admin/AdminSection'))
const UserSection = lazy(() => import(/* webpackChunkName: 'UserSection' */ 'Sections/User/UserSection'))
const ProjectSection = lazy(() => import(/* webpackChunkName: 'ProjectSection' */ 'Sections/Project/ProjectSection'))

const Index = () => {
  useDetectInputMode()
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())
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
              {currentOrg && LOCKED_ACCOUNT_STATUSES.includes(currentOrg.subscriptionStatus) &&
              <>
              <Route exact path={PATH_PROJECTS} component={LockedViewContainer} />
              <Route exact path={`${PATH_PROJECT}/:projectId`} component={LockedViewContainer} />
              <Route exact path={PATH_SETTINGS} component={LockedViewContainer} />
              </>
              }
              {currentOrg && !LOCKED_ACCOUNT_STATUSES.includes(currentOrg.subscriptionStatus) &&
              <>
              <Route exact path={PATH_PROJECTS} component={ProjectsSection} />
              <Route path={`${PATH_PROJECT}/:projectId`} component={ProjectSection} />
              <Route path={PATH_SETTINGS} component={UserSection} />
              </>
              }
              <Route path={PATH_ADMIN} component={AdminSection} />
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
