import { sendSingleRecipientEmail } from '../integrators/email'
import stripeIntegrator from '../integrators/stripe'
import BusinessOrganization from '../businesstime/organization'
import billingCoordinator from '../coordinators/billing'

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
      //update cached subscription status on org
      billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg(org.id)
      break
    }
    case 'charge.succeeded': {
      const subject = 'Payment successful'
      const message = 'Portway payment was successful'
      //not awaiting anything after this point to prevent timeout and possible duplication
      sendSingleRecipientEmail({ address: customer.email, textBody: message, htmlBody: message, subject })
      //update cached subscription status on org
      billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg(org.id)
      break
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      //update cached subscription status on org
      billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg(org.id)
      break
    }
  }
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