import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import store from './reducers'

import registerServiceWorker from './utilities/registerServiceWorker'

import Constants from 'Shared/constants'
import ProjectSection from 'Sections/Project/ProjectSection'
import ProjectsSection from 'Sections/Projects/ProjectsSection'
import DashboardSection from 'Sections/Dashboard/DashboardSection'

const App = () => {
  return (
    <Provider store={store}>
      <Router basename={Constants.PATH_APP}>
        <div className="app-container">
          <Route exact path="/project/:projectId" component={ProjectSection} />
          <Route exact path="/projects" component={ProjectsSection} />
          <Route exact path="/dashboard" component={DashboardSection} />
        </div>
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
