import { STRIPE_STATUS, PLANS } from '../constants/plans'

export const ORG_SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE', //COVERS Stripe status of 'canceled' and also when there's no subscription
  INCOMPLETE: 'INCOMPLETE', //when first payment fails, or Part of European SCA requirements https://stripe.com/docs/billing/migration/strong-customer-authentication
  INCOMPLETE_EXPIRED: 'INCOMPLETE_EXPIRED', //Also SCA
  PAST_DUE: 'PAST_DUE',
  PENDING_CANCEL: 'PENDING_CANCEL', //NO PARALLEL STRIPE API STATUS
  TRIALING: 'TRIALING',
  TRIALING_PENDING_ACTIVE: 'TRIALING_PENDING_ACTIVE', //NO PARALLEL STRIPE API STATUS
  UNPAID: 'UNPAID'
}

export const getOrgSubscriptionStatusFromStripeCustomer = function(customer) {
  const subscription = customer.subscriptions.data[0]
  const billingSource = customer.sources.data[0]

  if (!subscription) {
    return ORG_SUBSCRIPTION_STATUS.INACTIVE
  }

  // user has initiated cancellation
  if (subscription.cancel_at_period_end) {
    return ORG_SUBSCRIPTION_STATUS.PENDING_CANCEL
  }

  // special case where org still has trial time left, but has already entered billing info to subscribe when trial ends
  if (subscription.status === STRIPE_STATUS.TRIALING
      && subscription.plan.id === PLANS.SINGLE_USER
      && billingSource) {
    return ORG_SUBSCRIPTION_STATUS.TRIALING_PENDING_ACTIVE
  }

  switch (subscription.status) {
    case STRIPE_STATUS.ACTIVE:
      return ORG_SUBSCRIPTION_STATUS.ACTIVE
    case STRIPE_STATUS.CANCELED:
      return ORG_SUBSCRIPTION_STATUS.INACTIVE
    case STRIPE_STATUS.INCOMPLETE:
      return ORG_SUBSCRIPTION_STATUS.INCOMPLETE
    case STRIPE_STATUS.INCOMPLETE_EXPIRED:
      return ORG_SUBSCRIPTION_STATUS.INCOMPLETE_EXPIRED
    case STRIPE_STATUS.PAST_DUE:
      return ORG_SUBSCRIPTION_STATUS.PAST_DUE
    case STRIPE_STATUS.TRIALING:
      return ORG_SUBSCRIPTION_STATUS.TRIALING
    case STRIPE_STATUS.UNPAID:
      return ORG_SUBSCRIPTION_STATUS.UNPAID
  }
}