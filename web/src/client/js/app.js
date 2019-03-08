import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import registerServiceWorker from './utilities/registerServiceWorker'

import Constants from 'Shared/constants'
import rootReducer from './reducers'
import ProjectSection from 'Sections/Project/ProjectSection'
import ProjectsSection from 'Sections/Projects/ProjectsSection'
import DashboardSection from 'Sections/Dashboard/DashboardSection'

const middlewares = [thunk]
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

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
