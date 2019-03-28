import { getCookieValue } from '../utilities/cookieParser'
import jwt from 'jsonwebtoken'

const token = getCookieValue('token')

export default jwt.decode(token).userId
