// These plan values _must_ match the Stripe subscription plans
// and need to be updated in the client constants plans!
export const PLANS = {
  SINGLE_USER: 'SINGLE_USER',
  MULTI_USER: 'MULTI_USER',
  SINGLE_USER_FREE: 'SINGLE_USER_FREE',
  MULTI_USER_FREE: 'MULTI_USER_FREE'
}

export const TRIAL_PERIOD_DAYS = 30

// S3 asset storage allowed per plan
// 1e10 = 10gb
export const PLAN_ASSET_STORAGE_BYTES = {
  [PLANS.SINGLE_USER]: 1e10,
  [PLANS.SINGLE_USER_FREE]: 1e10,
  [PLANS.MULTI_USER]: 1e10,
  [PLANS.MULTI_USER_FREE]: 1e10
}

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

export const MULTI_USER_DEFAULT_SEAT_COUNT = 5

export const ORG_SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE', //COVERS Stripe status of 'canceled' and also when there's no subscription
  INCOMPLETE: 'INCOMPLETE', //when first payment fails, or Part of European SCA requirements https://stripe.com/docs/billing/migration/strong-customer-authentication
  INCOMPLETE_EXPIRED: 'INCOMPLETE_EXPIRED', //Also SCA
  PAST_DUE: 'PAST_DUE',
  PENDING_CANCEL: 'PENDING_CANCEL', //NO PARALLEL STRIPE API STATUS
  TRIALING: 'TRIALING',
  TRIAL_ENDED: 'TRIAL_ENDED', // NO PARALLEL STRIPE API STATUS
  TRIALING_PENDING_ACTIVE: 'TRIALING_PENDING_ACTIVE', //NO PARALLEL STRIPE API STATUS
  UNPAID: 'UNPAID'
}
