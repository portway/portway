import app from './app'

const port = process.env.SYNC_PORT

//START THE SERVER
app.listen(port, () => {
  console.info('api running on port ' + port)
})
