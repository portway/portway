import { STRIPE_STATUS, PLANS, ORG_SUBSCRIPTION_STATUS, PLAN_ID_MAP } from '../constants/plans'
const { STRIPE_PER_USER_PLAN_ID } = process.env

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
      && (subscription.plan.id === PLANS.SINGLE_USER || subscription.plan.id === STRIPE_PER_USER_PLAN_ID)
      && billingSource) {
    return ORG_SUBSCRIPTION_STATUS.TRIALING_PENDING_ACTIVE
  }

  // status is past due or active (stripe status will transition from trialing -> active -> past due over the course of an hour)
  // the user once had a trial (ie not an admin),
  // and we have no billing source, so we know the trial has ended and they have not signed up for a plan
  if (
    (subscription.status === STRIPE_STATUS.PAST_DUE ||
      subscription.status === STRIPE_STATUS.ACTIVE) &&
    subscription.trial_end &&
    !billingSource
  ) {
    return ORG_SUBSCRIPTION_STATUS.TRIAL_ENDED
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