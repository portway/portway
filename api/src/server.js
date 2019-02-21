import app from './app'
import { connect, loadModels } from './db/db-connector'

const port = process.env.API_PORT


//CONNECT TO THE DB
connect({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  db: process.env.DB_NAME
}).then(() => {
  console.info('successfully connected to db')
  //LOAD MODELS
  loadModels()
  console.info('successfully loaded models')

  //START THE SERVER
  app.listen(port, () => {
    console.info('api running on port ' + port)
  })
})
