import app from './app'
import { loadIO } from './libs/io'
import controllerLoader from './socketControllers'
import { jwtMiddleware } from './libs/ioAuth'

const port = process.env.SYNC_PORT

//START THE SERVER
const server = app.listen(port, () => {
  console.info('sync running on port ' + port)
})
const io = loadIO(server)
io.use(jwtMiddleware)
controllerLoader(io)
