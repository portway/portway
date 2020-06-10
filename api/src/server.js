import app from './app'
import { connect, loadModels } from './db/dbConnector'
const { exec } = require('child_process')

const port = process.env.API_PORT

// exec('dig +trace us.data.logs.insight.rapid7.com', (err, stdout, stderr) => {
//   if (err) {
//     console.log(err)
//     console.log(err.stack)
//     // node couldn't execute the command
//     return;
//   }

//   // the *entire* stdout and stderr (buffered)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// });


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
}).catch((err) => {
  console.error('Error starting API')
  console.error(err)
})
