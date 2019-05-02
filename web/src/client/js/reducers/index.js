import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'

import { documents } from './documents'
import { documentFields } from './documentFields'
import { projects } from './projects'
import { projectAssignments } from './projectAssignments'
import { userAssignments } from './userAssignments'
import { users } from './users'
import { ui } from './ui'

const rootReducer = combineReducers({
  documents,
  documentFields,
  projects,
  projectAssignments,
  userAssignments,
  users,
  ui
})

const middlewares = [thunk]
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

export default store
