import { sendSingleRecipientEmail } from '../integrators/email'
import stripeIntegrator from '../integrators/stripe'
import BusinessOrganization from '../businesstime/organization'
import billingCoordinator from '../coordinators/billing'
<<<<<<< HEAD
import { ORG_SUBSCRIPTION_STATUS } from '../constants/plans'
=======
import logger from '../integrators/logger'
import { LOG_LEVELS } from '../constants/logging'
>>>>>>> release

async function handleEvent(event) {
  const eventData = event.data.object
  const stripeId = eventData.customer
  const customer = await stripeIntegrator.getCustomer(stripeId)
  const org = await BusinessOrganization.findByStripeId(stripeId)

  switch (event.type) {
    case 'charge.failed': {
      const subject = 'Payment failed'
      const message = 'Portway payment failed'
      //not awaiting anything after this point to prevent timeout and possible duplication
      sendSingleRecipientEmail({ address: customer.email, textBody: message, htmlBody: message, subject })
      break
    }
    case 'charge.succeeded': {
      const subject = 'Payment successful'
      const message = 'Portway payment was successful'
      //not awaiting anything after this point to prevent timeout and possible duplication
      sendSingleRecipientEmail({ address: customer.email, textBody: message, htmlBody: message, subject })
      break
    }
    case 'customer.subscription.deleted': {
      //TODO send email letting customer know account is cancelled
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
  }
  //update cached subscription status on org, we want to do this for all current events
  await billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg(org.id)
  logger(LOG_LEVELS.INFO, { source: 'stripe webhook', eventType: event.type, orgId: org.id, stripeId })
}

export default {
  handleEvent
}

/*
Supported events:
  charge.captured
  charge.dispute.created
  charge.failed
  charge.refunded
  charge.succeeded
  checkout.session.completed
  customer.created
  customer.deleted
  customer.source.created
  customer.source.updated
  customer.subscription.created
  customer.subscription.deleted
  customer.subscription.updated
  customer.updated
  invoice.created
  invoice.finalized
  invoice.payment_failed
  invoice.payment_succeeded
  invoice.updated
  payment_intent.amount_capturable_updated
  payment_intent.canceled
  payment_intent.created
  payment_intent.payment_failed
  payment_intent.succeeded
  payment_method.attached

  NOTES:

  - to use, each one must be individually enabled in the stripe dashboard for the stripehooks endpoint
  - to get the current list of available events using the stripe cli run:
  stripe trigger --help
*/