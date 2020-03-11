import addRequest from '../libs/zendesk'
import slack from '../libs/slack'

const SupportController = function(router) {
  router.post('/', async (req, res) => {
    const { email, message, name, subject, company } = req.body
    slack.sendNotification(
      `:question: Support :question: \n Email: ${email} \n Name: ${name} \n Company: ${company} \n Subject: ${subject} \n Message: ${message}`
    )
    await addRequest(email, message, company, name, subject)
    if (req.get('origin') === 'https://getportway.com') {
      res.redirect('https://getportway.com/support?received=true')
    } else if (req.get('origin') === 'http://localhost:8080') {
      res.redirect('http://localhost:8080/support?received=true')
    } else {
      res.send()
    }
  })
}

export default SupportController
