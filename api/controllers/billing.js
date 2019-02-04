const billingController = function(router) {
  router.post('/billing', (req, res) => {
    console.log(req.body)
  })
}

export default billingController