export default {
  tokenSecret: process.env.JWT_SECRET,
  issuer: 'bonkeybong',
  audience: 'projectdanger',
  expiration: '1h'
}
