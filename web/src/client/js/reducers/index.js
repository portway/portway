import { combineReducers } from 'redux'

import { project } from './project'
import { projects } from './projects'

const App = combineReducers({
  project,
  projects
})

export default App
