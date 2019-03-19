import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import store from './reducers'
import registerServiceWorker from './utilities/registerServiceWorker'

import Constants from 'Shared/constants'

import DashboardSection from 'Sections/Dashboard/DashboardSection'
import ProjectsSection from 'Sections/Projects/ProjectsSection'
import ProjectSection from 'Sections/Project/ProjectSection'
import ProjectNew from 'Sections/Project/ProjectNew'

const App = () => {
  return (
    <Provider store={store}>
      <Router basename={Constants.PATH_APP}>
        <>
          <Route exact path={Constants.PATH_DASHBOARD} component={DashboardSection} />
          <Route exact path={Constants.PATH_PROJECTS} component={ProjectsSection} />
          <Route exact path={Constants.PATH_PROJECT_CREATE} component={ProjectNew} />
          <Route exact path={`${Constants.PATH_PROJECT}/:projectId`} component={ProjectSection} />
        </>
      </Router>
    </Provider>
  )
}

console.info('executing react app mount')
render(<App />, document.getElementById('application'))

registerServiceWorker()

// Todo: Investigate why the globals.js doesnt work for this one
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept()
}
