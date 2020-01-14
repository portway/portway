import addRequest from '../libs/zendesk'

const SupportController = function(router) {
  router.post('/', async (req, res) => {
    const { email, message, name, subject, company } = req.body
    const type = req.body['request-type']
    await addRequest(email, message, company, name, subject, type)
    // TODO: decide where to send user
    res.redirect('https://getportway.com')
  })
}

export default SupportController