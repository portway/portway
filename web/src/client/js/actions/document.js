import Constants from 'Shared/constants'
import { Documents } from './index'
import { add, fetch } from '../api'

export const fetchDocument = (projectId, documentId) => {
  return async (dispatch) => {
    dispatch(Documents.requestOne(projectId, documentId))
    const data = await fetch(`projects/${projectId}/documents/${documentId}`)
    dispatch(Documents.receiveOne(data))
  }
}

export const createDocument = (projectId, body, history) => {
  return async (dispatch) => {
    dispatch(Documents.create(projectId))
    const data = await add('projectDocument', body)
    dispatch(Documents.receiveOneCreated(data))
    history.push({ pathname: `${Constants.PATH_PROJECT}/${projectId}/documents/${data.id}` })
  }
}
