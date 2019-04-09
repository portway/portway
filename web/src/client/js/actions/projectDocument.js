import { ProjectDocuments } from './index'
import { fetch } from '../api'

export const fetchProjectDocuments = (projectId) => {
  return async (dispatch) => {
    dispatch(ProjectDocuments.request(projectId))
    const data = await fetch(`projects/${projectId}/documents`)
    dispatch(ProjectDocuments.receive(projectId, data))
  }
}
