import { getCookieValue } from '../utilities/cookieParser'
import jwt from 'jsonwebtoken'

const token = getCookieValue('token')
const decodedJwt = jwt.decode(token)

export const currentUserId = decodedJwt.userId

export const currentOrgId = decodedJwt.orgId
