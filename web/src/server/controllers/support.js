import addRequest from '../libs/zendesk'
import slack from '../libs/slack'

const SupportController = function(router) {
  router.post('/', async (req, res) => {
    const { email, message, name, subject, company } = req.body
    slack.sendNotification(
      `:question: Support :question: \n Email: ${email} \n Name: ${name} \n Company: ${company} \n Subject: ${subject} \n Message: ${message}`
    )
    await addRequest(email, message, company, name, subject)
    // If we're getting hit from the external website, do a redirect
    if (req.get('origin') === process.env.SUPPORT_FORM_SUBMIT_ORIGIN) {
      const base = process.env.SUPPORT_FORM_SUBMIT_ORIGIN
      const path = 'support?received=true'
      const url = new URL(path, base)
      res.redirect(url.toString())
    } else {
      // otherwise respond for xhr since we can't stop redirects
      res.send()
    }
  })
}

export default SupportController
