export default {
  tokenSecret: process.env.JWT_SECRET,
  passwordResetTokenSecret: process.env.PASSWORD_RESET_JWT_SECRET,
  issuer: 'bonkeybong',
  audience: 'portway',
  expiration: '7 days',
  passwordResetExpiration: '1 days'
}
