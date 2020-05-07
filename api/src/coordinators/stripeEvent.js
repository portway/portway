import stripeIntegrator from '../integrators/stripe'
import BusinessOrganization from '../businesstime/organization'
import billingCoordinator from '../coordinators/billing'
import emailCoordinator from '../coordinators/email'
import logger from '../integrators/logger'
import { LOG_LEVELS } from '../constants/logging'
import slackIntegrator from '../integrators/slack'
import { ORG_SUBSCRIPTION_STATUS } from '../constants/plans'

async function handleEvent(event) {
  const eventData = event.data.object
  const stripeId = eventData.customer
  const customer = await stripeIntegrator.getCustomer(stripeId)
  const org = await BusinessOrganization.findByStripeId(stripeId)

  switch (event.type) {
    case 'charge.failed': {
      // No need to await webhook
      emailCoordinator.sendPaymentFailed(customer.email)
      break
    }
    case 'charge.succeeded': {
      // No need to await webhook
      emailCoordinator.sendPaymentSuccess(customer.email)
      // not awaiting this, sends a notification to slack channel
      slackIntegrator.sendNotification(`:moneybag: ${customer.email} was successfully charged :moneybag:`)
      break
    }
    case 'customer.subscription.deleted': {
      // No need to await webhook
      emailCoordinator.sendSubscriptionCanceled(customer.email)
      break
    }
    case 'customer.source.created':
    case 'customer.source.updated': {
      await stripeIntegrator.updateCustomer(stripeId, {
        metadata: {
          country: eventData.address_country,
          state: eventData.address_state,
          zip: eventData.address_zip
        }
      })
      break
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      break
    case 'customer.subscription.trial_will_end':
      emailCoordinator.sendTrialWillEnd(customer.email)
      break
    case 'invoice.payment_failed':
      // customer has no billing information and has 'TRIALING' status cached on their org, send a trial canceled email
      if (!customer.sources.data.length && org.subscriptionStatus === ORG_SUBSCRIPTION_STATUS.TRIALING) {
        emailCoordinator.sendTrialEnded(customer.email)
      }
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
  customer.subscription.trial_will_end
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