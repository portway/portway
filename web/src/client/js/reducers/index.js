import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'

import { documents } from './documents'
import { projects } from './projects'
import { projectDocuments } from './projectDocuments'
import { users } from './users'

const rootReducer = combineReducers({
  documents,
  projects,
  projectDocuments,
  users
})

const middlewares = [thunk]
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

export default store
