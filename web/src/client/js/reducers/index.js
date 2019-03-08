import { combineReducers } from 'redux'
import { project, projects } from './projects'

const App = combineReducers({
  project,
  projects
})

export default App
