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
        // TODO: do we want to log this? It's not an error, it's a 404
        console.warn(e)
        return done(null, false)
      }

      const tokenData = pick(validatedBusinessToken, ['id', 'roleId', 'projectId', 'orgId'])
      tokenData.type = RESOURCE_TYPES.PROJECT_TOKEN
      done(null, tokenData)
    })
  )
}
