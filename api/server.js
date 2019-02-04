import app from './app'

const port = process.env.API_PORT

console.log(port)

//START THE SERVER
//=============================================================================

app.listen(port, function() {
  console.log('api running on port ' + port)
})
