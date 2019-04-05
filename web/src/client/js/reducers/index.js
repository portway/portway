import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'

import { projects } from './projects'
import { projectDocuments } from './projectDocuments'
import { users } from './users'

const rootReducer = combineReducers({
  projects,
  users,
  projectDocuments
})

const middlewares = [thunk]
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

export default store
