import { sendSingleRecipientEmail } from '../integrators/email'
import billingCoordinator from './billing'

async function handleEvent(event) {
  switch (event.type) {
    case 'charge.failed':
      const email = event.data.object.billing_details.email
      const subject = 'Payment failed'
      const message = 'Portway payment failed'
      // TODO email user
      // deactivate account
    case 'charge.succeeded':
      //TODO email user
      const email = event.data.object.billing_details.email
      const subject = 'Payment successful'
      const message = 'Portway payment was successful'
      await sendSingleRecipientEmail({ address: email, textBody: message, subject })
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

  run:
  stripe trigger --help

  to get the current list using the stripe cli
*/