import React from 'react'
import { render } from 'react-dom'

import ProjectContainer from './components/ProjectComponent'

class DashboardContainer extends React.Component {
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <ProjectContainer />
      </div>
    )
  }
}

render(<DashboardContainer />, document.getElementById('dashboard'))

// Todo: Investigate why the globals.js doesnt work for this one
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept()
}
