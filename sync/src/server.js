import app from './app'
import { loadIO } from './libs/socket'

const port = process.env.SYNC_PORT

//START THE SERVER
const server = app.listen(port, () => {
  console.info('api running on port ' + port)
})

loadIO(server)
