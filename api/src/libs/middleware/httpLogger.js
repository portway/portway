import morgan from 'morgan'
import logger, { streamableLog } from '../../integrators/logger'

let logFormat = 'dev'
let options = {}

// TODO: add back
//if (process.env.NODE_ENV === 'production') {
if (true) {
  logFormat = 'r_addr=:remote-addr method=:method url=":url" http=:http-version status=:status size=:res[content-length] res_time=:response-time'

  options = {
    stream: streamableLog,
    skip: (req, res) => {
      return req.method === 'OPTIONS'
    }
  }
}

const httpLogger = morgan(logFormat, options)

export default httpLogger