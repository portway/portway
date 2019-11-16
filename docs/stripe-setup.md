# Stripe

## Initial setup

For our stripe integration to function, a few things need to be setup in the stripe dashboard:

### Create the subscription plans

  - Go to Billing/Products
  - Click Add Pricing Plan for each:

Single User
  - Plan Nickname: `Single User`
  - ID: `SINGLE_USER`
  - Pricing: `Recurring Quantity`
  - Currency: `USD`
  - Does this pricing plan have multiple price tiers based on quantity? `No`
  - Price per unit: `$<Single User Plan Price>` per `seat`
  - Billing interval: `Monthly`
  - Trial Period: `0` days NOTE: this will be set programmatically

Multi User
  - Plan Nickname: `Multi User`
  - ID: `MULTI_USER`
  - Pricing: `Recurring Quantity`
  - Currency: `USD`
  - Does this pricing plan have multiple price tiers based on quantity? `Yes`
  - Tiering type: `For the first`	First unit: `0`	Last unit: `5`	Price per unit: `0`	Flat fee: `$<Multi User Plan Price>`
  - Tiering type: `For the next` First unit: `6` Last unit: `Infinity` Price per unit: `$<Seat Unit Price>` Flat fee: `0`
  - Billing interval: `Monthly`
  - Trial Period: `0` days

### Set API credentials

In the Developers/API Keys section Stripe provides us with a `publishable key` and a `secret key`

the publishable key needs to be passed into the `web` server ENV as `STRIPE_PUBLISHABLE_KEY`

the secret key need to be passed into the `api` server ENV as `STRIPE_SECRET`

### Set up webhook events

In the Developers/Webhooks section

- click `Add Endpoint`
- Endpoint URL: `https://<portwayAPItargetdomain>/api/stripehooks`
- Events to send: `charge.succeeded` `charge.failed`

Go to the created webhook and retrieve the signing secret

this will need to be passed into the `api` server ENV as `STRIPE_HOOK_SECRET`
