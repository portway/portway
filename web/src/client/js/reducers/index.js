import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'

import { documents } from './documents'
import { documentFields } from './documentFields'
import { validation } from './validation'
import { notifications } from './notifications'
import { projects } from './projects'
import { projectUsers } from './projectUsers'
import { projectTokens } from './projectTokens'
import { ui } from './ui'
import { users } from './users'
import { userAssignments } from './userAssignments'
import { organizations } from './organizations'
import { userProjects } from './userProjects'
import { projectAssignments } from './projectAssignments'

const rootReducer = combineReducers({
  documents,
  documentFields,
  validation,
  notifications,
  projects,
  projectUsers,
  projectTokens,
  ui,
  users,
  userAssignments,
  organizations,
  userProjects,
  projectAssignments
})

const middlewares = [thunk]
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

export default store
