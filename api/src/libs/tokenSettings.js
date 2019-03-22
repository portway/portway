export default {
  tokenSecret: process.env.JWT_SECRET,
  passwordResetTokenSecret: process.env.PASSWORD_RESET_JWT_SECRET,
  issuer: 'bonkeybong',
  audience: 'projectdanger',
  expiration: '7 days'
}
