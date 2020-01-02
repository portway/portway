import rsg from '../libs/randomStringGenerator'
import tokenGenerator from '../integrators/token'
import jwt from 'jsonwebtoken'
import BusinessProjectToken from '../businesstime/projecttoken'
import tokenSettings from '../libs/tokenSettings'

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

// Returns a promise that rejects if token is not verifiable
export const verifyProjectToken = async (token) => {
  return new Promise(async (resolve, reject) => {
    const tokenData = jwt.decode(token)

    if (!tokenData || (!tokenData.id || !tokenData.orgId)) {
      return reject(new Error(`token does not contain encoded id or orgId ${token}`))
    }

    const businessToken = await BusinessProjectToken.findByIdUnsanitized(tokenData.id, tokenData.orgId)
    if (!businessToken) return reject(new Error(`No project token found for ${token}`))

    const options = {
      issuer: tokenSettings.issuer
    }

    jwt.verify(token, businessToken.secret, options, (err, payload) => {
      if (err) {
        reject(err)
      } else {
        resolve(businessToken)
      }
    })
  })
}