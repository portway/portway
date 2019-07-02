export const BILLING_PUBLIC_FIELDS = Object.freeze(['currency', 'name', 'balance'])

// These are all the available fields returned from Stripe, uncomment to return from our API billing endpoints
export const BILLING_SOURCE_PUBLIC_FIELDS = Object.freeze([
  'address_city',
  'address_country',
  'address_line1',
  //address_line1_check,
  'address_line2',
  'address_state',
  'address_zip',
  //address_zip_check, ex: 'pass'
  'brand', //ex: 'Visa'
  //country, ex: 'US'
  //customer ex: 'cus_FDJOIxZ9aMzLGX'
  //cvc_check ex: 'pass'
  //dynamic_last4
  'exp_month',
  'exp_year',
  //fingerprint ex: 'W9ZHS9iux3p7Te28'
  //funding: ex: 'credit'
  //id ex: 'card_1EislaDBs6sqEFggmsUXQE28'
  'last4',
  //metadata ex: {}
  'name'
  //object ex: 'card'
  //tokenization_method
])
