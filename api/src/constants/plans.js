export const PLANS = {
  SINGLE_USER: 'SINGLE_USER',
  MULTI_USER: 'MULTI_USER'
}

export const TRIAL_PERIOD_DAYS = 10

// These come directly from stripe on subscription.status
// https://stripe.com/docs/billing/lifecycle
export const STRIPE_STATUS = {
  TRIALING: 'trialing',
  ACTIVE: 'active',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  UNPAID: 'unpaid'
}