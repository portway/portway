import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import registerServiceWorker from './utilities/registerServiceWorker'

import Constants from 'Shared/constants'
import rootReducer from './reducers'
import Header from 'Components/Header/Header'
import ProjectSection from 'Sections/Project/ProjectSection'
import ProjectNew from 'Sections/Project/ProjectNew'
import ProjectsSection from 'Sections/Projects/ProjectsSection'
import DashboardSection from 'Sections/Dashboard/DashboardSection'

const middlewares = [thunk]
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

const App = () => {
  return (
    <Provider store={store}>
      <Router basename={Constants.PATH_APP}>
        <React.Fragment>
          <Header />
          <Route exact path={Constants.PATH_DASHBOARD} component={DashboardSection} />
          <Route exact path={Constants.PATH_PROJECTS} component={ProjectsSection} />
          <Switch>
            <Route path={Constants.PATH_NEW_PROJECT} component={ProjectNew} />
            <Route path={`${Constants.PATH_PROJECT}/:projectId`} component={ProjectSection} />
          </Switch>
        </React.Fragment>
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
