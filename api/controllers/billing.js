export function BillingController(router) {
  router.post('/billing', (req, res) => {
    console.log(req.body)
  })
}
