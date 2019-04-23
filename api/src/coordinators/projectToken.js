import rsg from '../libs/randomStringGenerator'
import tokenGenerator from '../integrators/token'
import BusinessProjectToken from '../businesstime/projecttoken'

const SECRET_SIZE = 20

export const createProjectToken = async ({ name, projectId, roleId }, orgId) => {
  const secret = await rsg(SECRET_SIZE)
  const projectToken = await BusinessProjectToken.create({
    orgId,
    secret,
    projectId,
    roleId,
    name
  })

  const tokenString = await tokenGenerator.generateProjectToken(projectToken.id, secret, orgId)

  return await BusinessProjectToken.addTokenStringById(projectToken.id, tokenString, orgId)
}