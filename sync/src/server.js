import app from './app'
import { loadIO } from './libs/io'
import controllerLoader from './socketControllers'

const port = process.env.SYNC_PORT

//START THE SERVER
const server = app.listen(port, () => {
  console.info('api running on port ' + port)
})

const io = loadIO(server)
controllerLoader(io)
