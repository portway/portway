import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Constants from 'Shared/constants'
import rootReducer from './reducers'
import ProjectContainer from 'Containers/Project/Project'
import ProjectsContainer from 'Containers/Projects/Projects'
import DashboardContainer from 'Containers/Dashboard/Dashboard'
import Navigation from 'Components/Navigation/Navigation'

const middlewares = [thunk]
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

const App = () => {
  return (
    <Provider store={store}>
      <Router basename={Constants.PATH_APP}>
        <div className="app-container">
          <Navigation />
          <Route exact path="/project/:projectId" component={ProjectContainer} />
          <Route exact path="/projects" component={ProjectsContainer} />
          <Route exact path="/dashboard" component={DashboardContainer} />
        </div>
      </Router>
    </Provider>
  )
}

render(<App />, document.getElementById('application'))

// Todo: Investigate why the globals.js doesnt work for this one
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept()
}
