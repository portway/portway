import { ProjectDocuments } from './index'
import { add, fetch } from '../api'
import Constants from 'Shared/constants'

export const fetchProjectDocuments = (projectId) => {
  return async (dispatch) => {
    dispatch(ProjectDocuments.request(projectId))
    const data = await fetch(`projects/${projectId}/documents`)
    dispatch(ProjectDocuments.receive(data))
  }
}

export const createProjectDocument = (projectId, body, history) => {
  return async (dispatch) => {
    dispatch(ProjectDocuments.create(projectId))
    const data = await add('projectDocument', body)
    dispatch(ProjectDocuments.receiveOneCreated(data))
    history.push({ pathname: `${Constants.PATH_PROJECT}/${projectId}/documents/${data.id}` })
  }
}
