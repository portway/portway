import addRequest from '../libs/zendesk'

const SupportController = function(router) {
  router.post('/', async (req, res) => {
    const { email, message, name, subject, company } = req.body
    await addRequest(email, message, company, name, subject)
    res.redirect('https://getportway.com/support?received=true')
  })
}

export default SupportController
