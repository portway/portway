module.exports = () => {
  const port = parseInt(process.env.API_PORT, 10)
  if (isNaN(port) || port < 0) {
    throw new Error('API_PORT: must be a number greater than 0')
  }
}
