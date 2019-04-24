import { Strategy } from './projectTokenJWTStrategy'
import { verifyProjectToken } from '../../coordinators/projectToken'
import { pick } from '../utils'
import RESOURCE_TYPES from '../../constants/resourceTypes'

export default function(passport) {
  passport.use(
    new Strategy(async (token, done) => {
      let validatedBusinessToken
      try {
        validatedBusinessToken = await verifyProjectToken(token)
      } catch (e) {
        done(e)
      }

      const tokenData = pick(validatedBusinessToken, ['id', 'roleId', 'projectId', 'orgId'])
      tokenData.type = RESOURCE_TYPES.PROJECT_TOKEN
      done(null, tokenData)
    })
  )
}
