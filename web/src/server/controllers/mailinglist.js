import mailchimp from '../libs/mailchimp'

const { SUPPORT_FORM_SUBMIT_ORIGIN } = process.env

const MailingListController = function (router) {
  router.post('/', async (req, res) => {
    const { email } = req.body

    mailchimp.joinList(email)

    // If we're getting hit from the external website, do a redirect
    if (req.get('origin') === SUPPORT_FORM_SUBMIT_ORIGIN) {
      const referrer = req.get('Referrer')
      const url = `${referrer}?received=true`
      res.redirect(url)
    } else {
      // otherwise respond for xhr since we can't stop redirects
      res.send()
    }
  })
}

export default MailingListController
